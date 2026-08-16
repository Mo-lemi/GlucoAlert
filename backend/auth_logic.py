# auth_logic.py
# This file handles all Authentication & Session Security for GlucoAlert.
# We use Argon2id, the gold standard for password hashing.

from argon2 import PasswordHasher
from argon2.exceptions import VerifyMismatchError

# 1. INITIALIZE THE HASHER
# This object uses Argon2id by default. It automatically handles salts 
# and provides resistance against GPU-cracking and timing attacks.
ph = PasswordHasher()

# 2. MOCK DATABASE
# In a full version, this would be replaced by a SQL database.
# It stores data as: { "email": "secure_argon2_hash" }
user_db = {}

# 3. THE CORE SECURITY FUNCTIONS

def hash_new_password(plain_password):
    """
    Takes a plain text password and returns a secure Argon2id hash.
    Use this during User Registration.
    """
    return ph.hash(plain_password)

def verify_user_login(stored_hash, provided_password):
    """
    Compares the secure hash from the database with the user's login attempt.
    Returns True if correct, False if incorrect.
    """
    try:
        # ph.verify is secure against "Timing Attacks"
        ph.verify(stored_hash, provided_password)
        return True
    except VerifyMismatchError:
        # This error is raised if the password doesn't match the hash
        return False
    except Exception as e:
        # Catch any other unexpected errors
        print(f"Security Error: {e}")
        return False

# 4. THE INTERACTIVE TEST BLOCK
# This code ONLY runs when you execute this file directly.
# It will not run when your team members 'import' this file.

if __name__ == "__main__":
    print("========================================")
    print("   GLUCO-ALERT SECURITY SYSTEM (v1.0)   ")
    print("      Powered by Argon2id Hashing       ")
    print("========================================\n")

    # --- STEP 1: REGISTRATION ---
    print("--- [PHASE 1: USER REGISTRATION] ---")
    email = input("Enter your email: ")
    password = input("Create a strong password: ")

    print("\n[Security] Hashing password with Argon2id...")
    secure_hash = hash_new_password(password)
    
    # Store it in our mock database
    user_db[email] = secure_hash
    
    print("SUCCESS: User registered.")
    # Show the user what a 'bulletproof' hash looks like
    print(f"DATABASE STORAGE: {secure_hash[:40]}...") 
    print("----------------------------------------\n")

    # --- STEP 2: LOGIN ---
    print("--- [PHASE 2: USER LOGIN] ---")
    login_email = input("Email: ")
    login_pass = input("Password: ")

    # Check if user exists
    if login_email in user_db:
        stored_hash = user_db[login_email]
        
        # Check if the password is correct
        if verify_user_login(stored_hash, login_pass):
            print("\n✅ LOGIN SUCCESSFUL!")
            print(f"Welcome back, {login_email}. Session initialized.")
        else:
            print("\n❌ LOGIN FAILED: Incorrect password.")
            print("Security Note: The Argon2id hash did not match the input.")
    else:
        print("\n❌ LOGIN FAILED: User email not found in database.")

    print("\n========================================")