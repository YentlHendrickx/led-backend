-- Table: project_led.effects

-- DROP TABLE IF EXISTS project_led.effects

CREATE TABLE IF NOT EXISTS project_led.effects
(
    id bigint NOT NULL,
    name "char"[],
    CONSTRAINT effects_key PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS project_led.effects
    OWNER to postgres;
	
-- Table: project_led.colors

-- DROP TABLE IF EXISTS project_led.colors

CREATE TABLE IF NOT EXISTS project_led.colors
(
    id bigint NOT NULL,
    name "char"[],
	rgb_value "char"[],
    CONSTRAINT colors_key PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS project_led.colors
    OWNER to postgres;
	
-- Table: project_led.devices

-- DROP TABLE IF EXISTS project_led.devices

CREATE TABLE IF NOT EXISTS project_led.devices
(
    id bigint NOT NULL,
    name "char"[],
	ip "char"[],
	mac_address "char"[],
	led_count integer,
	last_seen timestamp with time zone,
    first_seen timestamp with time zone,
    CONSTRAINT devices_key PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS project_led.devices
    OWNER to postgres;

-- Table: project_led.parameters

-- DROP TABLE IF EXISTS project_led.parameters

CREATE TABLE IF NOT EXISTS project_led.parameters
(
    id bigint NOT NULL,
    name "char"[],
    CONSTRAINT parameters_key PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS project_led.parameters
    OWNER to postgres;
	
-- Table: project_led.effect_parameters

-- DROP TABLE IF EXISTS project_led.effect_parameters

CREATE TABLE IF NOT EXISTS project_led.effect_parameters
(
    id bigint NOT NULL,
	parameter_id bigint NOT NULL,
	effect_id bigint NOT NULL,
	
	CONSTRAINT fk_parameter 
		FOREIGN KEY(parameter_id) 
			REFERENCES project_led.parameters(id),
	CONSTRAINT fk_effect 
		FOREIGN KEY(effect_id)
			REFERENCES project_led.effects(id),
    CONSTRAINT effect_parameters_key PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS project_led.effect_parameters
    OWNER to postgres;
	
-- Table: project_led.device_effects

-- DROP TABLE IF EXISTS project_led.device_effects

CREATE TABLE IF NOT EXISTS project_led.device_effects
(
    id bigint NOT NULL,
	effect_id bigint NOT NULL,
	device_id bigint NOT NULL,
	color_id bigint,
	
	CONSTRAINT fk_effect 
		FOREIGN KEY(effect_id) 
			REFERENCES project_led.effects(id),
	CONSTRAINT fk_device 
		FOREIGN KEY(device_id)
			REFERENCES project_led.devices(id),
	CONSTRAINT fk_color 
		FOREIGN KEY(color_id)
			REFERENCES project_led.colors(id),
    CONSTRAINT device_effects_key PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS project_led.device_effects
    OWNER to postgres;

-- Table: project_led.parameter_values

-- DROP TABLE IF EXISTS project_led.parameter_values

CREATE TABLE IF NOT EXISTS project_led.parameter_values
(
    id bigint NOT NULL,
	effect_parameter_id bigint NOT NULL,
	device_effect_id bigint NOT NULL,
	value integer,
	
	CONSTRAINT fk_effect_parameter 
		FOREIGN KEY(effect_parameter_id) 
			REFERENCES project_led.effect_parameters(id),
	CONSTRAINT fk_device_effect 
		FOREIGN KEY(device_effect_id)
			REFERENCES project_led.device_effects(id),

    CONSTRAINT parameter_values_key PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS project_led.parameter_values
    OWNER to postgres;