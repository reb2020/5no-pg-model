-- ----------------------------
--  Function structure for public.uuid_nil()
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."uuid_nil"();
CREATE FUNCTION "public"."uuid_nil"() RETURNS "uuid" 
	AS '$libdir/uuid-ossp','uuid_nil'
	LANGUAGE c
	COST 1
	STRICT
	SECURITY INVOKER
	IMMUTABLE;
ALTER FUNCTION "public"."uuid_nil"() OWNER TO "reb";

-- ----------------------------
--  Function structure for public.uuid_ns_dns()
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."uuid_ns_dns"();
CREATE FUNCTION "public"."uuid_ns_dns"() RETURNS "uuid" 
	AS '$libdir/uuid-ossp','uuid_ns_dns'
	LANGUAGE c
	COST 1
	STRICT
	SECURITY INVOKER
	IMMUTABLE;
ALTER FUNCTION "public"."uuid_ns_dns"() OWNER TO "reb";

-- ----------------------------
--  Function structure for public.uuid_ns_url()
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."uuid_ns_url"();
CREATE FUNCTION "public"."uuid_ns_url"() RETURNS "uuid" 
	AS '$libdir/uuid-ossp','uuid_ns_url'
	LANGUAGE c
	COST 1
	STRICT
	SECURITY INVOKER
	IMMUTABLE;
ALTER FUNCTION "public"."uuid_ns_url"() OWNER TO "reb";

-- ----------------------------
--  Function structure for public.uuid_ns_oid()
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."uuid_ns_oid"();
CREATE FUNCTION "public"."uuid_ns_oid"() RETURNS "uuid" 
	AS '$libdir/uuid-ossp','uuid_ns_oid'
	LANGUAGE c
	COST 1
	STRICT
	SECURITY INVOKER
	IMMUTABLE;
ALTER FUNCTION "public"."uuid_ns_oid"() OWNER TO "reb";

-- ----------------------------
--  Function structure for public.uuid_ns_x500()
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."uuid_ns_x500"();
CREATE FUNCTION "public"."uuid_ns_x500"() RETURNS "uuid" 
	AS '$libdir/uuid-ossp','uuid_ns_x500'
	LANGUAGE c
	COST 1
	STRICT
	SECURITY INVOKER
	IMMUTABLE;
ALTER FUNCTION "public"."uuid_ns_x500"() OWNER TO "reb";

-- ----------------------------
--  Function structure for public.uuid_generate_v1()
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."uuid_generate_v1"();
CREATE FUNCTION "public"."uuid_generate_v1"() RETURNS "uuid" 
	AS '$libdir/uuid-ossp','uuid_generate_v1'
	LANGUAGE c
	COST 1
	STRICT
	SECURITY INVOKER
	VOLATILE;
ALTER FUNCTION "public"."uuid_generate_v1"() OWNER TO "reb";

-- ----------------------------
--  Function structure for public.uuid_generate_v1mc()
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."uuid_generate_v1mc"();
CREATE FUNCTION "public"."uuid_generate_v1mc"() RETURNS "uuid" 
	AS '$libdir/uuid-ossp','uuid_generate_v1mc'
	LANGUAGE c
	COST 1
	STRICT
	SECURITY INVOKER
	VOLATILE;
ALTER FUNCTION "public"."uuid_generate_v1mc"() OWNER TO "reb";

-- ----------------------------
--  Function structure for public.uuid_generate_v3(uuid, text)
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."uuid_generate_v3"(uuid, text);
CREATE FUNCTION "public"."uuid_generate_v3"(IN "namespace" uuid, IN "name" text) RETURNS "uuid" 
	AS '$libdir/uuid-ossp','uuid_generate_v3'
	LANGUAGE c
	COST 1
	STRICT
	SECURITY INVOKER
	IMMUTABLE;
ALTER FUNCTION "public"."uuid_generate_v3"(IN "namespace" uuid, IN "name" text) OWNER TO "reb";

-- ----------------------------
--  Function structure for public.uuid_generate_v4()
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."uuid_generate_v4"();
CREATE FUNCTION "public"."uuid_generate_v4"() RETURNS "uuid" 
	AS '$libdir/uuid-ossp','uuid_generate_v4'
	LANGUAGE c
	COST 1
	STRICT
	SECURITY INVOKER
	VOLATILE;
ALTER FUNCTION "public"."uuid_generate_v4"() OWNER TO "reb";

-- ----------------------------
--  Function structure for public.uuid_generate_v5(uuid, text)
-- ----------------------------
DROP FUNCTION IF EXISTS "public"."uuid_generate_v5"(uuid, text);
CREATE FUNCTION "public"."uuid_generate_v5"(IN "namespace" uuid, IN "name" text) RETURNS "uuid" 
	AS '$libdir/uuid-ossp','uuid_generate_v5'
	LANGUAGE c
	COST 1
	STRICT
	SECURITY INVOKER
	IMMUTABLE;
ALTER FUNCTION "public"."uuid_generate_v5"(IN "namespace" uuid, IN "name" text) OWNER TO "reb";


DROP TABLE IF EXISTS "public"."users";
CREATE TABLE "public"."users" (
	"id" uuid NOT NULL DEFAULT uuid_generate_v4(),
	"email" text NOT NULL COLLATE "default",
	"public_key" text NOT NULL COLLATE "default",
	"secret_key" text NOT NULL COLLATE "default",
	"personalised" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp(6) WITH TIME ZONE NOT NULL DEFAULT now(),
	"updated_at" timestamp(6) WITH TIME ZONE NOT NULL DEFAULT now()
)
WITH (OIDS=FALSE);

-- ----------------------------
--  Table structure for users_info
-- ----------------------------
DROP TABLE IF EXISTS "public"."users_info";
CREATE TABLE "public"."users_info" (
	"id" uuid NOT NULL DEFAULT uuid_generate_v4(),
	"user_id" uuid NOT NULL,
	"first_name" text COLLATE "default",
	"last_name" text COLLATE "default",
	"created_at" timestamp(6) WITH TIME ZONE NOT NULL DEFAULT now(),
	"updated_at" timestamp(6) WITH TIME ZONE NOT NULL DEFAULT now()
)
WITH (OIDS=FALSE);

-- ----------------------------
--  Table structure for users_address
-- ----------------------------
DROP TABLE IF EXISTS "public"."users_address";
CREATE TABLE "public"."users_address" (
	"id" uuid NOT NULL DEFAULT uuid_generate_v4(),
	"user_id" uuid NOT NULL,
	"street_name" text COLLATE "default",
	"postcode" text COLLATE "default",
	"created_at" timestamp(6) WITH TIME ZONE NOT NULL DEFAULT now(),
	"updated_at" timestamp(6) WITH TIME ZONE NOT NULL DEFAULT now()
)
WITH (OIDS=FALSE);

-- ----------------------------
--  Indexes structure for table users
-- ----------------------------
CREATE UNIQUE INDEX  "users_email_index" ON "public"."users" USING btree(email COLLATE "default" ASC NULLS LAST);
CREATE INDEX  "users_public_key_index" ON "public"."users" USING btree(public_key COLLATE "default" ASC NULLS LAST);
CREATE INDEX  "users_secret_key_index" ON "public"."users" USING btree(secret_key COLLATE "default" ASC NULLS LAST);


DROP TABLE IF EXISTS "public"."roles";
CREATE TABLE "public"."roles" (
	"id" uuid NOT NULL DEFAULT uuid_generate_v4(),
	"role" text NULL,
	"created_at" timestamp(6) WITH TIME ZONE NOT NULL DEFAULT now(),
	"updated_at" timestamp(6) WITH TIME ZONE NOT NULL DEFAULT now()
)
WITH (OIDS=FALSE);


DROP TABLE IF EXISTS "public"."user_roles";
CREATE TABLE "public"."user_roles" (
	"user_id" uuid NOT NULL,
	"role_id" uuid NOT NULL
)
WITH (OIDS=FALSE);