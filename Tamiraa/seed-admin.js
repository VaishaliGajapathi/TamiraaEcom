const bcrypt = require('bcrypt');
const initModels = require('./src/models');
require('dotenv').config();

async function seedAdminUser() {
  try {
    const models = await initModels();
    const { User } = models;

    // Check if admin already exists
    const existingAdmin = await User.findOne({
      where: { email: 'admin@tamiraa.com' }
    });

    if (existingAdmin) {
      console.log('✅ Admin user already exists');
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin@2025', 10);

    // Create admin user
    const adminUser = await User.create({
      username: 'Tamiraa Admin',
      phonenumber: '9999999999',
      email: 'admin@tamiraa.com',
      password: hashedPassword
    });

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@tamiraa.com');
    console.log('🔐 Password: admin@2025');
    console.log('👤 User ID:', adminUser.userId);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    process.exit(1);
  }
}

seedAdminUser();
