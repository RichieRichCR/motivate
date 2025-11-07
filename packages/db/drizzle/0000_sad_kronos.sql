CREATE TYPE "public"."goal_type" AS ENUM('daily', 'long_term');--> statement-breakpoint
CREATE TABLE "goals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"metric_type_id" integer NOT NULL,
	"type" "goal_type" NOT NULL,
	"target_value" numeric(10, 2) NOT NULL,
	"start_date" date NOT NULL,
	"target_date" date,
	"active" boolean DEFAULT true NOT NULL,
	"achieved" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "measurements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"metric_type_id" integer NOT NULL,
	"value" numeric(10, 2) NOT NULL,
	"measured_at" timestamp with time zone NOT NULL,
	"recorded_at" timestamp with time zone DEFAULT now() NOT NULL,
	"source" varchar(50) DEFAULT 'apple_health',
	"notes" text,
	CONSTRAINT "measurements_user_id_metric_type_id_measured_at_unique" UNIQUE("user_id","metric_type_id","measured_at")
);
--> statement-breakpoint
CREATE TABLE "metric_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(50) NOT NULL,
	"unit" varchar(20) NOT NULL,
	"description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "metric_types_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "goals" ADD CONSTRAINT "goals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "goals" ADD CONSTRAINT "goals_metric_type_id_metric_types_id_fk" FOREIGN KEY ("metric_type_id") REFERENCES "public"."metric_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "measurements" ADD CONSTRAINT "measurements_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "measurements" ADD CONSTRAINT "measurements_metric_type_id_metric_types_id_fk" FOREIGN KEY ("metric_type_id") REFERENCES "public"."metric_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_measurements_user_metric" ON "measurements" USING btree ("user_id","metric_type_id");--> statement-breakpoint
CREATE INDEX "idx_measurements_measured_at" ON "measurements" USING btree ("measured_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "idx_measurements_user_metric_date" ON "measurements" USING btree ("user_id","metric_type_id","measured_at" DESC NULLS LAST);