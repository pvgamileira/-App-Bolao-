-- ==========================================
-- Migração: Criação do Shadow Auth para Usuários Legados
-- ==========================================

-- Habilita pgcrypto se ainda não estiver habilitado (necessário para hashear a senha)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
DECLARE
    user_record RECORD;
    dummy_email TEXT;
    pwd_hash TEXT;
    zero_uuid UUID := '00000000-0000-0000-0000-000000000000';
BEGIN
    FOR user_record IN SELECT * FROM public.usuarios LOOP
        -- Remove espaços e converte para minúsculo
        dummy_email := regexp_replace(lower(trim(user_record.nome_guerra)), '\s+', '', 'g') || '@bolaodafirma.app';
        
        -- Garante que o PIN não seja nulo e remove espaços em branco
        pwd_hash := crypt(TRIM(COALESCE(user_record.pin::text, '0000')) || '00', gen_salt('bf'));

        -- Verifica se já não existe na auth.users para evitar erro de duplicidade
        IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = user_record.id) THEN
            
            -- Insere no auth.users
            INSERT INTO auth.users (
                id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, 
                raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, recovery_token, email_change_token_new, email_change
            ) VALUES (
                user_record.id, 
                zero_uuid, 
                'authenticated', 
                'authenticated', 
                dummy_email, 
                pwd_hash, 
                NOW(), 
                '{"provider":"email","providers":["email"]}', 
                '{}', 
                NOW(), 
                NOW(),
                '', '', '', ''
            );
        ELSE
            -- Se já existe (caso o script anterior rodou mas falhou depois), força a atualização da senha correta
            UPDATE auth.users 
            SET encrypted_password = pwd_hash, 
                email_confirmed_at = NOW() 
            WHERE id = user_record.id;
        END IF;

        -- Garante que a identidade de e-mail exista
        IF NOT EXISTS (SELECT 1 FROM auth.identities WHERE user_id = user_record.id AND provider = 'email') THEN
            INSERT INTO auth.identities (
                id, user_id, identity_data, provider, provider_id, created_at, updated_at
            ) VALUES (
                gen_random_uuid(), 
                user_record.id, 
                format('{"sub": "%s", "email": "%s"}', user_record.id, dummy_email)::jsonb, 
                'email', 
                user_record.id::text, 
                NOW(), 
                NOW()
            );
        END IF;
    END LOOP;
END $$;
