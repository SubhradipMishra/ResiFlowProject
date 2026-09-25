import mongoose from "mongoose";
import inquirer from "inquirer";
import dotenv from "dotenv";
import path from "path";
import SuperAdminModel from "../super-admin/super-admin.schema";
import dns from "dns";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

// Load environment variables from the server root
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const seedSuperAdmin = async () => {
    try {
        console.log("\n============================================");
        console.log("   ResiFlow Super Admin Initialization");
        console.log("============================================\n");

        if (!process.env.DB_URL) {
            console.error("❌ DB_URL is missing in your .env file!");
            process.exit(1);
        }

        console.log("Connecting to Database...");
        await mongoose.connect(process.env.DB_URL);
        console.log("✅ Database Connected!\n");

        const existing = await SuperAdminModel.findOne();
        if (existing) {
            console.log(`⚠️  A SuperAdmin account already exists: ${existing.email}`);
            const { override } = await inquirer.prompt([
                {
                    type: "confirm",
                    name: "override",
                    message: "Do you want to create another SuperAdmin? (Usually only 1 is needed)",
                    default: false,
                },
            ]);

            if (!override) {
                console.log("Aborting creation.");
                process.exit(0);
            }
        }

        const answers = await inquirer.prompt([
            {
                type: "input",
                name: "name",
                message: "Enter SuperAdmin Full Name:",
                validate: (val) => (val.trim() ? true : "Name cannot be empty"),
            },
            {
                type: "input",
                name: "email",
                message: "Enter SuperAdmin Email:",
                validate: (val) => (val.includes("@") ? true : "Please enter a valid email"),
            },
            {
                type: "input",
                name: "phone",
                message: "Enter SuperAdmin Phone Number:",
            },
            {
                type: "password",
                name: "password",
                message: "Enter SuperAdmin Password (Required for 2FA step 1):",
                mask: "*",
                validate: (val) => (val.length >= 6 ? true : "Password must be at least 6 characters"),
            },
        ]);

        console.log("\nCreating account...");

        const newAdmin = await SuperAdminModel.create({
            name: answers.name,
            email: answers.email.toLowerCase(),
            phone: answers.phone,
            password: answers.password,
            isEmailVerified: true,
            isActive: true,
        });

        console.log("✅ SuperAdmin created successfully!");
        console.log("--------------------------------------------");
        console.log(`Name:  ${newAdmin.name}`);
        console.log(`Email: ${newAdmin.email}`);
        console.log("--------------------------------------------");
        console.log("You can now login at the ResiFlow portal using this email and password, followed by an OTP verification.\n");

        process.exit(0);
    } catch (error: any) {
        console.error("❌ Initialization Failed:", error.message);
        process.exit(1);
    }
};

seedSuperAdmin();
