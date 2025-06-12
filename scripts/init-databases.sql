-- Create databases for each service
CREATE DATABASE talaty_auth;
CREATE DATABASE talaty_user;
CREATE DATABASE talaty_document;
CREATE DATABASE talaty_scoring;
CREATE DATABASE talaty_notification;

-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE talaty_auth TO talaty_user;
GRANT ALL PRIVILEGES ON DATABASE talaty_user TO talaty_user;
GRANT ALL PRIVILEGES ON DATABASE talaty_document TO talaty_user;
GRANT ALL PRIVILEGES ON DATABASE talaty_scoring TO talaty_user;
GRANT ALL PRIVILEGES ON DATABASE talaty_notification TO talaty_user;