#!/usr/bin/env python3
"""
Script to upgrade the messages table structure
Adds missing columns to match the new schema
"""

from database import get_db_connection

def upgrade_messages_table():
    """Upgrade messages table to include all required columns"""
    
    # Define required columns and their definitions
    required_columns = {
        'message_type': "TEXT DEFAULT 'text'",
        'context': "TEXT",
        'is_read': "BOOLEAN DEFAULT 0"
    }

    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Get existing columns
        cursor.execute("PRAGMA table_info(messages)")
        existing_columns = [row[1] for row in cursor.fetchall()]
        
        print(f"Existing columns: {existing_columns}")
        
        # Add missing columns
        for column_name, column_def in required_columns.items():
            if column_name not in existing_columns:
                alter_sql = f"ALTER TABLE messages ADD COLUMN {column_name} {column_def}"
                cursor.execute(alter_sql)
                print(f"✅ Added column: {column_name}")
            else:
                print(f"✅ Column already exists: {column_name}")

        conn.commit()
        print("✅ Messages table upgrade completed successfully!")
        
        # Verify final structure
        cursor.execute("PRAGMA table_info(messages)")
        final_columns = cursor.fetchall()
        print("\nFinal table structure:")
        for col in final_columns:
            print(f"  - {col[1]} ({col[2]})")
            
    except Exception as e:
        print(f"❌ Error upgrading table: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    upgrade_messages_table() 