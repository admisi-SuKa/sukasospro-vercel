-- Jalankan sekali di Neon SQL Editor. Tidak memodifikasi Google Sheets lama.
CREATE TABLE IF NOT EXISTS sospro_entities (
 collection text NOT NULL,
 id text NOT NULL,
 payload jsonb NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY (collection,id)
);
CREATE INDEX IF NOT EXISTS sospro_entities_collection_time ON sospro_entities(collection,created_at DESC);
CREATE INDEX IF NOT EXISTS sospro_entities_status ON sospro_entities(collection,(payload->>'status'));
CREATE TABLE IF NOT EXISTS sospro_sequences (
 prefix text NOT NULL,
 year text NOT NULL,
 value bigint NOT NULL,
 PRIMARY KEY(prefix,year)
);
CREATE TABLE IF NOT EXISTS sospro_users (
 username text PRIMARY KEY,
 display_name text NOT NULL,
 role text NOT NULL CHECK (role IN ('admin','pejabat')),
 salt text NOT NULL,
 password_hash text NOT NULL,
 active boolean NOT NULL DEFAULT true,
 session_version text NOT NULL,
 login_failures integer NOT NULL DEFAULT 0,
 locked_until timestamptz,
 created_at timestamptz NOT NULL DEFAULT now(),
 updated_at timestamptz NOT NULL DEFAULT now(),
 last_login_at timestamptz
);
-- Fitur tahun akademik, presensi, bahan, inventaris, permohonan,
-- file metadata, dan landing page dikelompokkan menurut collection.

-- Persetujuan peminjaman atomik: dua permohonan pada alat yang sama
-- tidak dapat sama-sama lolos pemeriksaan stok pada saat bersamaan.
CREATE OR REPLACE FUNCTION sospro_loan_transition(p_code text,p_status text,p_note text)
RETURNS jsonb LANGUAGE plpgsql AS $$
DECLARE r jsonb; inv jsonb; used_qty numeric; inv_id text;
BEGIN
 SELECT payload INTO r FROM sospro_entities WHERE collection='requests' AND id=p_code FOR UPDATE;
 IF r IS NULL OR r->>'kind'<>'ALAT' THEN RAISE EXCEPTION 'Peminjaman tidak ditemukan'; END IF;
 inv_id:=r->>'itemId';
 PERFORM pg_advisory_xact_lock(hashtext('sospro-inventory-'||inv_id));
 IF p_status='APPROVED' THEN
   IF r->>'status' NOT IN ('PENDING','REVISION') THEN RAISE EXCEPTION 'Status tidak dapat disetujui'; END IF;
 ELSIF p_status='OUT' THEN
   IF r->>'status'<>'APPROVED' THEN RAISE EXCEPTION 'Alat belum disetujui'; END IF;
 ELSIF p_status='RETURNED' THEN
   IF r->>'status'<>'OUT' THEN RAISE EXCEPTION 'Alat belum dipinjam'; END IF;
 ELSE RAISE EXCEPTION 'Perubahan status tidak dikenal'; END IF;
 IF p_status IN ('APPROVED','OUT') THEN
   SELECT payload INTO inv FROM sospro_entities WHERE collection='inventory' AND id=inv_id;
   IF inv IS NULL OR coalesce(inv->>'active','false') NOT IN ('true','TRUE') THEN RAISE EXCEPTION 'Alat tidak aktif'; END IF;
   SELECT coalesce(sum((payload->>'quantity')::numeric),0) INTO used_qty
   FROM sospro_entities
   WHERE collection='requests' AND id<>p_code AND payload->>'kind'='ALAT'
     AND payload->>'itemId'=inv_id AND payload->>'status' IN ('APPROVED','OUT')
     AND payload->>'dateStart'<=r->>'dateEnd' AND payload->>'dateEnd'>=r->>'dateStart';
   IF used_qty+coalesce((r->>'quantity')::numeric,0)>coalesce((inv->>'total')::numeric,0) THEN
     RAISE EXCEPTION 'Stok alat tidak mencukupi pada rentang tanggal';
   END IF;
 END IF;
 r=jsonb_set(jsonb_set(jsonb_set(r,'{status}',to_jsonb(p_status)), '{note}',to_jsonb(p_note)), '{updatedAt}',to_jsonb(to_char(now() at time zone 'UTC','YYYY-MM-DD"T"HH24:MI:SS"Z"')));
 UPDATE sospro_entities SET payload=r,updated_at=now() WHERE collection='requests' AND id=p_code;
 RETURN r;
END $$;
