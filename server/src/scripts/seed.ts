import { connectDatabase, disconnectDatabase } from "../database/connection.js";
import { User } from "../models/User.js";
import { Organization } from "../models/Organization.js";
import { ProblemStatement } from "../models/ProblemStatement.js";
import { AuditLog } from "../models/AuditLog.js";
import { config } from "../config/index.js";
import { logger } from "../utils/logger.js";
import { Types } from "mongoose";

const sampleOrganizations = [
  {
    name: "TechCorp Global",
    description: "Leading technology solutions provider",
    website: "https://techcorp.example.com",
    industry: "Technology" as const,
    contactPerson: "John Smith",
    contactEmail: "john@techcorp.example.com",
  },
  {
    name: "HealthFirst Labs",
    description: "Innovative healthcare research laboratory",
    website: "https://healthfirst.example.com",
    industry: "Healthcare" as const,
    contactPerson: "Dr. Sarah Johnson",
    contactEmail: "sarah@healthfirst.example.com",
  },
  {
    name: "GreenEnergy Solutions",
    description: "Sustainable energy technology startup",
    website: "https://greenenergy.example.com",
    industry: "Energy" as const,
    contactPerson: "Michael Green",
    contactEmail: "michael@greenenergy.example.com",
  },
];

const sampleProblems = [
  {
    title: "AI-Powered Customer Support Automation",
    description:
      "Develop an intelligent chatbot system that can handle complex customer queries, learn from interactions, and seamlessly escalate to human agents when necessary. The system should support multiple languages and integrate with existing CRM platforms.",
    track: "software" as const,
    category: "AI, Generative AI, Agentic AI & Intelligent Automation",
    industry: "Technology" as const,
    expectedOutcome:
      "A functional prototype that demonstrates 80% query resolution rate with natural conversation flow and sentiment analysis capabilities.",
    techStack: ["Python", "TensorFlow", "React", "Node.js"],
    difficulty: "hard" as const,
    datasets: "Sample customer interaction logs will be provided",
    apiLinks: "OpenAI API, Custom CRM API documentation",
    referenceLinks: ["https://example.com/chatbot-research"],
    ndaRequired: false,
    mentorsProvided: true,
    status: "approved" as const,
    featured: true,
  },
  {
    title: "Wearable Health Monitoring Device",
    description:
      "Design and prototype a non-invasive wearable device that can continuously monitor vital signs including heart rate, blood oxygen, and body temperature. The device should alert healthcare providers in real-time when anomalies are detected.",
    track: "hardware" as const,
    category: "Healthcare & Assistive Hardware",
    industry: "Healthcare" as const,
    expectedOutcome:
      "Working prototype with accompanying mobile app and cloud dashboard for healthcare providers.",
    techStack: ["Arduino", "ESP32", "React Native", "AWS IoT"],
    difficulty: "hard" as const,
    ndaRequired: true,
    mentorsProvided: true,
    status: "approved" as const,
    featured: true,
  },
  {
    title: "Smart Grid Energy Optimization",
    description:
      "Create a machine learning model that predicts energy consumption patterns and optimizes distribution across a smart grid network. The solution should reduce energy waste and integrate renewable energy sources efficiently.",
    track: "software" as const,
    category: "ClimateTech, AgriTech & Sustainability",
    industry: "Energy" as const,
    expectedOutcome:
      "ML model with visualization dashboard showing predicted vs actual consumption and optimization recommendations.",
    techStack: ["Python", "scikit-learn", "TensorFlow", "D3.js"],
    difficulty: "medium" as const,
    datasets: "Historical energy consumption data for 10,000 households",
    ndaRequired: false,
    mentorsProvided: true,
    status: "approved" as const,
    featured: false,
  },
  {
    title: "Blockchain-Based Supply Chain Tracking",
    description:
      "Develop a decentralized application for tracking products through the entire supply chain. The solution should provide transparency, prevent counterfeiting, and enable consumers to verify product authenticity.",
    track: "software" as const,
    category: "Cybersecurity, Blockchain & Digital Trust",
    industry: "Technology" as const,
    expectedOutcome:
      "DApp with smart contracts deployed on testnet, mobile scanning app, and admin dashboard.",
    techStack: ["Solidity", "Ethereum", "React", "IPFS"],
    difficulty: "hard" as const,
    ndaRequired: false,
    mentorsProvided: false,
    status: "approved" as const,
    featured: false,
  },
  {
    title: "AI Medical Image Analysis Platform",
    description:
      "Build an AI-powered platform that assists radiologists in analyzing medical images (X-rays, MRIs, CT scans) to detect potential abnormalities. Focus on accuracy, speed, and explainability of predictions.",
    track: "software" as const,
    category: "HealthTech, BioTech & MedTech",
    industry: "Healthcare" as const,
    expectedOutcome:
      "Web platform with image upload, AI analysis, heatmap visualization, and confidence scores.",
    techStack: ["Python", "PyTorch", "FastAPI", "React"],
    difficulty: "hard" as const,
    datasets: "Anonymized medical imaging dataset will be provided",
    ndaRequired: true,
    mentorsProvided: true,
    status: "pending" as const,
    featured: false,
  },
  {
    title: "IoT-Based Smart Irrigation System",
    description:
      "Design an IoT system for precision agriculture that monitors soil moisture, weather conditions, and crop health to automate irrigation. The system should minimize water usage while maximizing crop yield.",
    track: "hardware" as const,
    category: "IoT & Smart Devices",
    industry: "Agriculture" as const,
    expectedOutcome:
      "Sensor network prototype with cloud dashboard and mobile app for farmers.",
    techStack: ["Raspberry Pi", "LoRaWAN", "Python", "React"],
    difficulty: "medium" as const,
    ndaRequired: false,
    mentorsProvided: true,
    status: "approved" as const,
    featured: false,
  },
  {
    title: "Personalized Learning Platform",
    description:
      "Create an adaptive learning platform that uses AI to personalize educational content based on student learning patterns, preferences, and progress. Include gamification elements to boost engagement.",
    track: "software" as const,
    category: "EdTech & Smart Learning",
    industry: "Education" as const,
    expectedOutcome:
      "Functional web platform with course modules, progress tracking, and AI-driven recommendations.",
    techStack: ["Next.js", "Python", "PostgreSQL", "TensorFlow"],
    difficulty: "medium" as const,
    ndaRequired: false,
    mentorsProvided: true,
    status: "approved" as const,
    featured: true,
  },
  {
    title: "Robotic Rehabilitation Assistant",
    description:
      "Develop a robotic arm prototype that assists physical therapy patients with guided exercises. The robot should adapt to patient capabilities and track progress over time.",
    track: "hardware" as const,
    category: "Robotics & Automation",
    industry: "Healthcare" as const,
    expectedOutcome:
      "Working prototype with basic movement assistance and patient feedback system.",
    techStack: ["ROS", "Python", "Arduino", "React"],
    difficulty: "hard" as const,
    ndaRequired: true,
    mentorsProvided: true,
    status: "pending" as const,
    featured: false,
  },
  {
    title: "Real-time Fraud Detection System",
    description:
      "Build a machine learning system that detects fraudulent transactions in real-time for e-commerce platforms. The system should handle millions of transactions per day with minimal false positives.",
    track: "software" as const,
    category: "FinTech & Digital Payments",
    industry: "Finance" as const,
    expectedOutcome:
      "Scalable fraud detection API with dashboard showing detection rates and transaction analysis.",
    techStack: ["Python", "Apache Kafka", "XGBoost", "FastAPI", "PostgreSQL"],
    difficulty: "hard" as const,
    ndaRequired: false,
    mentorsProvided: true,
    status: "approved" as const,
    featured: false,
  },
  {
    title: "Autonomous Drone Navigation System",
    description:
      "Create a computer vision-based navigation system for delivery drones that can navigate urban environments, avoid obstacles, and find optimal delivery routes.",
    track: "hardware" as const,
    category: "Robotics & Automation",
    industry: "Transportation" as const,
    expectedOutcome:
      "Simulation environment with working obstacle avoidance and path planning algorithms.",
    techStack: ["Python", "OpenCV", "ROS", "TensorFlow", "PX4"],
    difficulty: "hard" as const,
    ndaRequired: false,
    mentorsProvided: true,
    status: "approved" as const,
    featured: true,
  },
  {
    title: "Mental Health Companion App",
    description:
      "Develop a mobile application that provides mental health support through AI-powered conversations, mood tracking, and personalized coping strategies. Include crisis detection and professional referral features.",
    track: "software" as const,
    category: "HealthTech, BioTech & MedTech",
    industry: "Healthcare" as const,
    expectedOutcome:
      "Cross-platform mobile app with secure data handling and integration with mental health resources.",
    techStack: ["React Native", "Node.js", "MongoDB", "OpenAI API"],
    difficulty: "medium" as const,
    ndaRequired: false,
    mentorsProvided: true,
    status: "approved" as const,
    featured: false,
  },
  {
    title: "Sustainable Fashion Marketplace",
    description:
      "Build a platform connecting sustainable fashion brands with eco-conscious consumers. Include carbon footprint tracking, material transparency, and circular fashion features like clothing swaps.",
    track: "software" as const,
    category: "ClimateTech, AgriTech & Sustainability",
    industry: "Retail" as const,
    expectedOutcome:
      "Full-stack marketplace with sustainability scoring and vendor management system.",
    techStack: ["Next.js", "PostgreSQL", "Stripe", "Redis"],
    difficulty: "medium" as const,
    ndaRequired: false,
    mentorsProvided: false,
    status: "approved" as const,
    featured: false,
  },
];

async function seed(): Promise<void> {
  try {
    logger.info("Starting database seed...");

    await connectDatabase();

    logger.info("Clearing existing data...");
    await Promise.all([
      User.deleteMany({}),
      Organization.deleteMany({}),
      ProblemStatement.deleteMany({}),
      AuditLog.deleteMany({}),
    ]);

    logger.info("Creating admin user...");
    const admin = await User.create({
      email: config.admin.email,
      password: config.admin.password,
      name: "Admin User",
      role: "admin",
    });
    logger.info(`Admin user created: ${admin.email}`);

    logger.info("Creating organizations and users...");
    const createdOrgs: Array<{ org: any; user: any }> = [];

    for (let i = 0; i < sampleOrganizations.length; i++) {
      const orgData = sampleOrganizations[i];

      const user = await User.create({
        email: `org${i + 1}@example.com`,
        password: "Password@123",
        name: orgData.contactPerson,
        role: "organization",
      });

      const org = await Organization.create({
        userId: user._id,
        ...orgData,
        verified: true,
      });

      createdOrgs.push({ org, user });
      logger.info(`Created organization: ${org.name}`);
    }

    logger.info("Creating problem statements...");
    for (let i = 0; i < sampleProblems.length; i++) {
      const problemData = sampleProblems[i];
      const orgIndex = i % createdOrgs.length;
      const { org } = createdOrgs[orgIndex];

      const problem = await ProblemStatement.create({
        organizationId: org._id,
        ...problemData,
        contactPerson: org.contactPerson,
        contactEmail: org.contactEmail,
        reviewedBy: problemData.status !== "pending" ? admin._id : undefined,
        reviewedAt: problemData.status !== "pending" ? new Date() : undefined,
      });

      if (problemData.status === "approved") {
        await AuditLog.create({
          adminId: admin._id,
          action: "APPROVE_PROBLEM",
          targetType: "problem",
          targetId: problem._id,
          details: `Approved problem statement: ${problem.title}`,
        });
      }

      logger.info(`Created problem: ${problem.title} (${problem.status})`);
    }

    logger.info("Seed completed successfully!");
    logger.info("\n=== Login Credentials ===");
    logger.info(`Admin: ${config.admin.email} / ${config.admin.password}`);
    logger.info(
      "Organizations: org1@example.com, org2@example.com, org3@example.com / Password@123",
    );
  } catch (error) {
    logger.error("Seed failed", error);
    throw error;
  } finally {
    await disconnectDatabase();
  }
}

seed().catch((error) => {
  logger.error("Seed script failed", error);
  process.exit(1);
});
