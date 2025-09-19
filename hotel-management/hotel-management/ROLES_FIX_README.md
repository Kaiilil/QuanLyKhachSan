# Fix for Roles Table Issue

## Problem
The application was throwing the following error:
```
Field 'IDROLE' doesn't have a default value
```

This occurred because there was a mismatch between the JPA entity configuration and the database schema:

1. **JPA Entity**: Uses `@GeneratedValue(strategy = GenerationType.IDENTITY)` expecting auto-increment
2. **Database Schema**: `IDROLE INT PRIMARY KEY` without `AUTO_INCREMENT`

## Solution
The fix involves updating the database schema to match the JPA entity configuration.

### Files Modified:

1. **`database_complete.sql`** - Updated the `tb_Roles` table definition:
   ```sql
   -- Before
   CREATE TABLE tb_Roles (
     IDROLE INT PRIMARY KEY,
     ROLENAME NVARCHAR(50)
   );
   
   -- After
   CREATE TABLE tb_Roles (
     IDROLE INT PRIMARY KEY AUTO_INCREMENT,
     ROLENAME NVARCHAR(50)
   );
   ```

2. **`RoleInitializer.java`** - Added error handling and Vietnamese role names:
   - Added try-catch block for better error handling
   - Added Vietnamese role names ("Người dùng", "Admin")
   - Improved logging

3. **`fix_roles_table.sql`** - Created a standalone script to fix existing databases

## How to Apply the Fix

### For New Deployments:
Use the updated `database_complete.sql` file.

### For Existing Databases:
Run the `fix_roles_table.sql` script:

```sql
-- Connect to your database and run:
USE quanly_khachsan;

-- Drop and recreate the table
DROP TABLE IF EXISTS tb_Roles;

CREATE TABLE tb_Roles (
  IDROLE INT PRIMARY KEY AUTO_INCREMENT,
  ROLENAME NVARCHAR(50)
);

-- Insert default roles
INSERT INTO tb_Roles (ROLENAME) VALUES 
(N'Người dùng'),
(N'Admin');
```

## Verification
After applying the fix, the application should start without the "Field 'IDROLE' doesn't have a default value" error, and the role initialization should work properly.

## Notes
- This fix maintains backward compatibility with existing JPA entity configuration
- The auto-increment approach is more consistent with JPA best practices
- The role initialization now includes both English and Vietnamese role names 