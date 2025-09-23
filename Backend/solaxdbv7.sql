-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 23, 2025 at 10:02 AM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `solaxdbv7`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `admin_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`admin_id`, `user_id`) VALUES
(2, 2);

-- --------------------------------------------------------

--
-- Table structure for table `blog`
--

CREATE TABLE `blog` (
  `blog_id` int(10) UNSIGNED NOT NULL,
  `admin_id` int(11) DEFAULT NULL,
  `title` varchar(200) NOT NULL,
  `content` text NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `image` text CHARACTER SET utf16 COLLATE utf16_bin DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `status` enum('draft','published','archived') DEFAULT 'draft',
  `likes` int(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `blog`
--

INSERT INTO `blog` (`blog_id`, `admin_id`, `title`, `content`, `category`, `image`, `created_at`, `updated_at`, `status`, `likes`) VALUES
(1, 2, 'Top 5 Benefits of Solar Energy for Homeowners', '<p>\r\n  As energy costs continue to rise, more and more homeowners are turning to solar power as a smart, sustainable solution. <a style=\"color: blue;\" href=\"https://en.wikipedia.org/wiki/Solar_energy\" target=\"_blank\" rel=\"noopener noreferrer\">Solar energy</a> is not just a trend—it’s a powerful way to cut costs, increase property value, and reduce your impact on the environment. Let’s explore the top 5 benefits of solar energy for homeowners:\r\n</p>\r\n<h1><b>1. Lower Electricity Bills</b></h1>\r\n<p>\r\n  One of the most obvious benefits of installing solar panels is the significant reduction in your electricity bills. Once your system is installed, it generates free electricity from the sun—so you buy less from your utility company.\r\n</p>\r\n<p>\r\n  Example: Many homeowners see a 50%–90% drop in monthly electricity costs depending on system size and location.\r\n</p>\r\n<h1><b>2. Environmentally Friendly</b></h1>\r\n<p>\r\n  Solar energy is clean, renewable, and sustainable. Unlike traditional energy sources like coal or gas, it doesn’t release harmful greenhouse gases or pollute the air.\r\n</p>\r\n<p>\r\n  Benefit: By switching to solar, you’re helping fight climate change and making a positive impact on the planet for future generations.\r\n</p>\r\n<h1><b>3. Increase in Property Value</b></h1>\r\n<p>\r\n  Homes with solar energy systems are often valued higher and sell faster. Buyers appreciate the long-term savings and energy independence that come with solar.\r\n</p>\r\n<p>\r\n  Fact: According to studies, homes with solar panels can sell for up to 4% more than similar homes without them.\r\n</p>\r\n<h1><b>4. Energy Independence</b></h1>\r\n<p>\r\n  With solar panels, you rely less on the grid and more on your own energy production. This means protection against rising electricity prices and power outages—especially when paired with a battery system.\r\n</p>', 'residential', 'Backend\\uploads\\blog5.jpg', '2025-08-09 07:38:15', '2025-09-08 16:02:56', 'published', 0),
(2, 7, 'How Solar Panels Work: A Beginner’s Guide', '<p>\r\n  Solar panels are one of the most popular ways to produce clean, renewable energy. You’ve probably seen them on rooftops, in fields, or even powering small gadgets — but have you ever wondered how they actually work? Let’s break it down step by step in simple terms.\r\n</p>\r\n<h1><b>1. The Basics: What Are Solar Panels?</b></h1>\r\n<p>\r\n  A solar panel is a device made up of many small units called <a style=\"color: blue;\"href=\"https://en.wikipedia.org/wiki/Solar_cell\" target=\"_blank\" rel=\"noopener noreferrer\">solar cells</a> (also known as photovoltaic or PV cells). These cells are usually made from a material called silicon, which is great at converting sunlight into electricity.\r\n</p>\r\n<p>\r\n  When sunlight hits a solar panel, the solar cells absorb the energy from the sun and start a process that produces electric power.\r\n</p>\r\n<h1><b>2. Step-by-Step: How Sunlight Becomes Electricity</b></h1>\r\n<h3>Step 1: Sunlight Hits the Solar Cells</h3>\r\n<p>\r\n  Each solar cell contains layers of silicon and special chemicals that create an electric field. When sunlight (made up of tiny particles called photons) hits the cell, it knocks electrons loose from the atoms in the silicon.\r\n</p>\r\n<h3>Step 2: Electric Current Is Created</h3>\r\n<p>\r\n  The loose electrons start to move, and the electric field in the cell pushes them in a certain direction. This movement of electrons is what we call electricity.\r\n</p>\r\n<h3>Step 3: The Inverter Converts Power</h3>\r\n<p>\r\n  The electricity generated by solar cells is direct current (DC). Most of our home appliances use alternating current (AC), so an inverter is used to change DC into AC.\r\n</p>\r\n<h3>Step 4: Powering Your Home (or Storing It)</h3>\r\n<p>\r\n  Once converted to AC, the electricity flows into your home’s electrical panel to power lights, fans, TVs, and other devices. If your solar system makes more electricity than you use, the extra power can be stored in solar batteries or sent back to the grid (if your area supports net metering).\r\n</p>\r\n<h1><b>3. The Key Components of a Solar System</b></h1>\r\n<ul>\r\n  <li><strong>Solar Panels</strong> – Capture sunlight and produce DC electricity.</li>\r\n  <li><strong>Inverter</strong> – Converts DC into AC electricity.</li>\r\n  <li><strong>Mounting System</strong> – Holds panels securely on rooftops or the ground.</li>\r\n  <li><strong>Battery (Optional)</strong> – Stores extra energy for later use.</li>\r\n  <li><strong>Meter</strong> – Tracks electricity production and usage.</li>\r\n</ul>\r\n<h1><b>4. Why Solar Panels Are Worth It</b></h1>\r\n<ul>\r\n  <li><strong>Save on electricity bills</strong> – Use free energy from the sun instead of buying it from the grid.</li>\r\n  <li><strong>Eco-friendly</strong> – Reduce your carbon footprint by using renewable energy.</li>\r\n  <li><strong>Low maintenance</strong> – Solar panels have no moving parts and can last 25+ years.</li>\r\n</ul>', 'technology', 'Backend\\uploads\\blog4.jpg', '2025-08-09 07:41:18', '2025-09-08 16:09:53', 'published', 0),
(3, 7, 'Is Solar Worth It in 2025? Financial Insights', '<p>\r\n  As we settle into 2025, homeowners and businesses are re-evaluating whether investing in solar power still makes sense. In this post, we\'ll walk you through the latest financial metrics—costs, incentives, payback timelines—and what to consider before installing solar this year.\r\n</p>\r\n<h1><b>1. Current Installation Costs & Incentives</b></h1>\r\n<h3>Cost Overview (U.S.)</h3>\r\n<ul>\r\n  <li>A typical 12 kW solar installation averages about $20,754 after the federal tax credit, with the range reaching from $17,883 (low end) to $23,379 (high end).</li>\r\n  <li>Generally, homeowners can expect upfront costs between $15,000 and $40,000, depending on system size and regional variables.</li>\r\n</ul>\r\n<h3>Federal Solar Tax Credit</h3>\r\n<p>\r\n  The <a style=\"color: blue;\"href=\"https://en.wikipedia.org/wiki/Energy_Policy_Act_of_2005\" target=\"_blank\" rel=\"noopener noreferrer\">30% Investment Tax Credit (ITC)</a> remains available through 2025 and is a key driver of affordability.\r\n</p>\r\n<p>\r\n  Starting in 2026, payback periods may extend significantly—up to 43% longer—making installations before year-end 2025 particularly advantageous.\r\n</p>\r\n<h1><b>2. Return on Investment & Payback Timelines</b></h1>\r\n<ul>\r\n  <li><strong>Household ROI</strong> – Average annual savings are around $1,500, with most homeowners recouping their investment within 10 to 12 years.</li>\r\n  <li><strong>Payback Trends</strong> – With current federal incentives, the average payback falls close to 7 years. Without the tax credit (in 2026 onward), it climbs to 10+ years.</li>\r\n  <li><strong>Lifetime Savings</strong> – Over 25 years, households often save between $34,000 to $120,000.</li>\r\n</ul>\r\n<h1><b>3. Additional Value Drivers</b></h1>\r\n<ul>\r\n  <li><strong>Increase in Home Resale Value</strong> – Homes with solar panels frequently sell for about 6.9% more, typically adding over $25,000 to the sale price.</li>\r\n  <li><strong>Energy Rate Hedge</strong> – Solar power often costs around 8 cents per kWh, which is less than half the average utility rate of 17 cents per kWh.</li>\r\n</ul>\r\n<h1><b>4. Risks & Considerations</b></h1>\r\n<ul>\r\n  <li><strong>Industry Instability</strong> – Some solar companies have gone bankrupt in recent years, leaving customers without support despite signed contracts. Legal safeguards like the FTC’s Holder Rule may offer some protection.</li>\r\n  <li><strong>Policy Uncertainty</strong> – Programs like Solar for All are being halted, with $7 billion in grants recently canceled, potentially impacting adoption rates.</li>\r\n</ul>\r\n<h1>Bottom Line</h1>\r\n<p>\r\n  For many homeowners, going solar in 2025 is financially compelling—especially before the end of the ITC. Acting now could maximize your return and lock in savings for decades to come.\r\n</p>', 'finance', 'Backend\\uploads\\blog3.jpg', '2025-08-09 07:43:36', '2025-09-08 16:08:49', 'published', 0),
(4, 2, 'Eco-Friendly Living with Solar Energy', '<p>\r\n  <a style=\"color: blue;\"href=\"https://en.wikipedia.org/wiki/Solar_energy\" target=\"_blank\" rel=\"noopener noreferrer\">Solar energy</a> isn’t just for saving money—it’s part of a sustainable lifestyle.\r\n</p>\r\n<p>\r\n  When people think about solar power, the first thing that often comes to mind is saving money on electricity bills. While that’s true, the benefits of solar go far beyond financial savings. Installing solar panels is a powerful step toward living an eco-friendly lifestyle and reducing your environmental impact.\r\n</p>\r\n<h1><b>1. Reducing Your Carbon Footprint</b></h1>\r\n<p>\r\n  Electricity from traditional power plants is usually generated by burning fossil fuels like coal, oil, or natural gas. This process releases carbon dioxide (CO₂) and other greenhouse gases into the atmosphere—major contributors to climate change.\r\n</p>\r\n<p>\r\n  <b>By switching to solar energy, you can:</b>\r\n</p>\r\n<ul>\r\n  <li>Reduce your home’s CO₂ emissions by thousands of pounds each year.</li>\r\n  <li>Contribute to cleaner air and a healthier environment.</li>\r\n  <li>Play your part in slowing down global warming.</li>\r\n</ul>\r\n<h1><b>2. Supporting Renewable Energy Growth</b></h1>\r\n<p>\r\n  Every solar panel installation helps increase the demand for clean, renewable energy. This creates a ripple effect:\r\n</p>\r\n<ul>\r\n  <li>More solar farms and manufacturing facilities are developed.</li>\r\n  <li>The renewable energy industry grows, creating green jobs.</li>\r\n  <li>Society moves closer to a future less dependent on polluting fuels.</li>\r\n</ul>\r\n<h1><b>3. Living Sustainably at Home</b></h1>\r\n<p>\r\n  Solar panels can be part of a larger eco-friendly lifestyle. Here’s how to integrate them with other sustainable practices:\r\n</p>\r\n<ul>\r\n  <li>Pair solar panels with energy-efficient appliances to maximize savings.</li>\r\n  <li>Use LED lighting instead of incandescent bulbs.</li>\r\n  <li>Combine solar with a home battery to store excess energy for nighttime use.</li>\r\n  <li>Consider electric vehicles (EVs) charged with your own solar power for carbon-free driving.</li>\r\n</ul>\r\n<h1><b>4. Saving Resources Beyond Electricity</b></h1>\r\n<p>\r\n  Solar energy systems require minimal water to operate—unlike traditional power plants, which use large amounts of water for cooling. Choosing solar helps preserve water resources, especially in drought-prone areas.\r\n</p>\r\n<h1><b>5. Inspiring Others in Your Community</b></h1>\r\n<p>\r\n  When friends, family, or neighbors see you living sustainably, they’re more likely to make eco-friendly choices too. Your home becomes a visible example of how modern technology can work hand-in-hand with environmental responsibility.\r\n</p>', 'life style', 'Backend\\uploads\\blog2.jpg', '2025-08-09 07:47:14', '2025-09-08 15:50:25', 'published', 0),
(5, 7, 'Community Solar Projects: Powering Neighborhoods Together', '<p>Learn how community solar programs allow individuals to benefit from solar power without installing panels on their own homes.</p>\r\n<p>\r\nNot every home is suitable for solar panels. Maybe your roof is shaded, too small, or you rent your property. But that doesn’t mean you have to miss out on the benefits of solar power. Community solar projects make it possible for everyone to tap into clean, renewable energy—no rooftop installation required.\r\n</p>\r\n<h1><b>1. What Is Community Solar?</b></h1>\r\n<p>\r\nCommunity solar is a shared solar energy system where multiple households or businesses subscribe to a single large solar farm. Instead of installing your own panels, you buy or lease a share of the project’s output.\r\n\r\nThe electricity generated is sent to the local power grid, and your share of the energy is credited to your utility bill—this is known as virtual net metering.\r\n</p>\r\n<h1><b>2. How It Works</b></h1>\r\n<p>\r\nA solar farm or large array of panels is built in your area.\r\nYou subscribe to a portion of that system.\r\nThe solar farm generates electricity and sends it to the grid.\r\nYour utility company applies bill credits based on your share of the energy produced.\r\n</p>\r\n<h1><b>\r\n3. Benefits of Community Solar</b></h1>\r\n<p>\r\nNo Installation Required – Perfect for renters, apartment dwellers, and homes with unsuitable roofs.\r\nLower Energy Bills – Subscribers often save between 5–20% on electricity costs.\r\nEnvironmentally Friendly – Reduces reliance on fossil fuels and lowers greenhouse gas emissions.\r\nFlexible Options – Many programs allow you to join or leave without long-term contracts.\r\nLocal Impact – Supports renewable energy projects within your community.</p>\r\n<h1><b>\r\n4. Who Can Join?</b></h1>\r\n<p>\r\nHomeowners and renters\r\nSmall businesses\r\nNonprofits and schools\r\nPeople living in multi-unit housing\r\nParticipation depends on your utility provider and whether a project exists in your region.\r\n</p>\r\n<p style=\"color: blue;\">You can learn more about community solar on <a href=\"https://en.wikipedia.org/wiki/Community_solar\" target=\"_blank\" rel=\"noopener noreferrer\">Wikipedia</a>.</p>', 'community', 'Backend\\uploads\\blog1.jpg', '2025-08-09 07:48:24', '2025-09-08 14:02:39', 'published', 0);

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `cart_id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`cart_id`, `customer_id`, `created_at`, `updated_at`) VALUES
(1, 1, '2025-07-10 00:24:28', '2025-07-10 00:24:28'),
(2, 4, '2025-07-18 20:43:26', '2025-07-18 20:43:26');

-- --------------------------------------------------------

--
-- Table structure for table `cart_item`
--

CREATE TABLE `cart_item` (
  `item_id` int(11) NOT NULL,
  `cart_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `added_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart_item`
--

INSERT INTO `cart_item` (`item_id`, `cart_id`, `product_id`, `quantity`, `added_at`) VALUES
(30, 2, 2, 1, '2025-07-18 20:43:26'),
(52, 1, 2, 2, '2025-09-18 07:57:37'),
(53, 1, 9, 1, '2025-09-19 08:28:19');

-- --------------------------------------------------------

--
-- Table structure for table `chat_message`
--

CREATE TABLE `chat_message` (
  `message_id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `sender_role` enum('customer','admin') NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `receiver_type` enum('customer','provider','admin') NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `is_read` tinyint(1) DEFAULT 0,
  `conversation_id` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `chat_sessions`
--

CREATE TABLE `chat_sessions` (
  `message_id` int(11) NOT NULL,
  `chatSession_id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `sent_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `chat_sessions`
--

INSERT INTO `chat_sessions` (`message_id`, `chatSession_id`, `sender_id`, `receiver_id`, `message`, `is_read`, `sent_at`) VALUES
(1, 3, 3, 1, 'hi buddy', 0, '2025-07-17 05:06:36'),
(2, 3, 1, 3, 'yeah tell me', 0, '2025-07-18 04:29:31'),
(3, 3, 3, 1, 'I need your help with something important', 0, '2025-09-05 14:40:08'),
(4, 3, 1, 3, 'Sure, whats going on? Im here to help', 0, '2025-09-05 14:40:08'),
(5, 3, 3, 1, 'Im planning a surprise party for Sarah this weekend', 0, '2025-09-05 14:40:08'),
(6, 3, 1, 3, 'Oh wow! Thats awesome! What do you need me to do?', 0, '2025-09-05 14:40:08'),
(7, 3, 3, 1, 'Can you help with decorations and keep it secret?', 0, '2025-09-05 14:40:08'),
(8, 3, 1, 3, 'Absolutely! Im great at keeping secrets. When should I come over?', 0, '2025-09-05 14:40:08'),
(9, 3, 3, 1, 'How about Saturday morning at 10 AM? Well have 3 hours before she gets home', 0, '2025-09-05 14:40:08'),
(10, 3, 1, 3, 'Perfect! Ill bring balloons and streamers. Should I get a cake too?', 0, '2025-09-05 14:40:08'),
(11, 3, 3, 1, 'Yes please! Chocolate is her favorite. Youre a lifesaver!', 0, '2025-09-05 14:40:08'),
(12, 3, 1, 3, 'No problem! This is going to be amazing. She ll be so surprised!', 0, '2025-09-05 14:40:08'),
(13, 3, 1, 3, 'Hello, I need help with my service request', 1, '2025-07-17 03:50:15'),
(14, 3, 3, 1, 'I can help you with that. What is the issue', 1, '2025-07-17 03:51:30'),
(15, 3, 1, 3, 'The appliance is making strange noises', 0, '2025-07-17 03:52:45'),
(16, 4, 4, 3, 'Hi, I have a question about the service', 1, '2025-07-17 06:44:00'),
(17, 4, 3, 4, 'Please let me know how I can assist you', 1, '2025-07-17 06:45:20'),
(18, 4, 4, 3, 'When can you start the repair work', 0, '2025-07-17 06:46:40'),
(19, 5, 4, 3, 'I need another service at my location', 1, '2025-07-21 11:53:10'),
(20, 5, 3, 4, 'What type of service do you require', 1, '2025-07-21 11:54:25'),
(21, 5, 4, 3, 'I need plumbing work in the bathroom', 0, '2025-07-21 11:55:40'),
(22, 6, 1, 6, 'Hello, I am interested in your cleaning service', 1, '2025-07-21 11:53:15'),
(23, 6, 6, 1, 'Thank you. What size is your apartment', 1, '2025-07-21 11:54:30'),
(24, 6, 1, 6, 'It is a two bedroom apartment', 0, '2025-07-21 11:55:45'),
(25, 7, 1, 3, 'I have another issue with different appliance', 1, '2025-07-25 11:10:15'),
(26, 7, 3, 1, 'Please describe the problem you are facing', 1, '2025-07-25 11:11:30'),
(27, 7, 1, 3, 'The washing machine is not spinning properly', 0, '2025-07-25 11:12:45'),
(28, 8, 1, 3, 'Need help with electrical work at home', 1, '2025-07-26 16:18:45'),
(29, 8, 3, 1, 'What specific electrical issue are you having', 1, '2025-07-26 16:20:00'),
(30, 8, 1, 3, 'The lights are flickering in living room', 0, '2025-07-26 16:21:15'),
(31, 3, 3, 1, 'testing msg', 0, '2025-09-06 02:53:53'),
(32, 3, 3, 1, 'testing msg1', 0, '2025-09-06 02:56:03'),
(33, 6, 6, 1, 'testing msg1', 0, '2025-09-06 03:11:15');

-- --------------------------------------------------------

--
-- Table structure for table `contact_request`
--

CREATE TABLE `contact_request` (
  `contact_id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `provider_id` int(11) DEFAULT NULL,
  `service_id` int(11) DEFAULT NULL,
  `status` enum('pending','accepted','rejected') DEFAULT 'pending',
  `requested_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contact_request`
--

INSERT INTO `contact_request` (`contact_id`, `customer_id`, `provider_id`, `service_id`, `status`, `requested_at`) VALUES
(41, 1, 3, 1, 'accepted', '2025-07-15 09:02:48'),
(42, 1, 6, 4, 'pending', '2025-07-15 09:02:49'),
(43, 4, 3, 1, 'accepted', '2025-07-17 06:43:06'),
(44, 4, 3, 5, 'accepted', '2025-07-18 19:17:51'),
(45, 1, 3, 5, 'accepted', '2025-07-21 05:19:45'),
(46, 1, 3, 3, 'accepted', '2025-07-25 11:05:50'),
(47, 1, 3, 2, 'rejected', '2025-07-26 16:18:01'),
(48, 1, 3, 7, 'accepted', '2025-08-24 13:37:26'),
(49, 1, 3, 2, 'accepted', '2025-09-07 04:40:57'),
(50, 1, 3, 14, 'rejected', '2025-09-18 07:23:45'),
(51, 56, 3, 5, 'pending', '2025-09-18 07:37:47');

-- --------------------------------------------------------

--
-- Table structure for table `conversation`
--

CREATE TABLE `conversation` (
  `chatSession_id` int(11) NOT NULL,
  `request_id` int(11) DEFAULT NULL,
  `customer_id` int(11) NOT NULL,
  `provider_id` int(11) NOT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `started_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `conversation`
--

INSERT INTO `conversation` (`chatSession_id`, `request_id`, `customer_id`, `provider_id`, `is_active`, `started_at`, `updated_at`) VALUES
(3, 41, 1, 3, 1, '2025-07-17 03:49:59', '2025-07-17 03:49:59'),
(4, 43, 4, 3, 1, '2025-07-17 06:43:22', '2025-07-17 06:43:22'),
(5, 44, 4, 3, 1, '2025-07-21 11:52:43', '2025-07-21 11:52:43'),
(6, 45, 1, 6, 1, '2025-07-21 11:52:46', '2025-08-24 14:58:47'),
(7, 46, 1, 3, 1, '2025-07-25 11:09:47', '2025-07-25 11:09:47'),
(8, 47, 1, 3, 1, '2025-07-26 16:18:07', '2025-07-26 16:18:07'),
(12, 49, 1, 3, 1, '2025-09-16 16:26:55', '2025-09-16 16:26:55'),
(13, 50, 1, 3, 1, '2025-09-19 06:28:51', '2025-09-19 06:28:51'),
(14, 48, 1, 3, 1, '2025-09-19 09:54:20', '2025-09-19 09:54:20');

-- --------------------------------------------------------

--
-- Table structure for table `customer`
--

CREATE TABLE `customer` (
  `customer_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `contact_number` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customer`
--

INSERT INTO `customer` (`customer_id`, `user_id`, `contact_number`) VALUES
(1, 1, '0779298700'),
(10, 56, '0779298700');

-- --------------------------------------------------------

--
-- Table structure for table `installation_request`
--

CREATE TABLE `installation_request` (
  `request_id` int(11) NOT NULL,
  `installation_address` text DEFAULT NULL,
  `roof_height` decimal(5,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `installation_request`
--

INSERT INTO `installation_request` (`request_id`, `installation_address`, `roof_height`) VALUES
(13, '30 sir pon ramnathan road', 999.99);

-- --------------------------------------------------------

--
-- Table structure for table `jobapply`
--

CREATE TABLE `jobapply` (
  `jobId` int(11) NOT NULL,
  `fullName` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `contactMethod` enum('phone','whatsapp','email') DEFAULT 'phone',
  `jobRole` varchar(100) DEFAULT NULL,
  `resume` longblob DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `jobapply`
--

INSERT INTO `jobapply` (`jobId`, `fullName`, `email`, `phone`, `contactMethod`, `jobRole`, `resume`, `created_at`) VALUES
(1, 'janakan', 'qwer@gmail.com', '0779298700', 'phone', '', 0x726573756d655f363863616364336134356663395f4c65637475726520322d537461636b2e706466, '2025-09-17 20:31:14'),
(2, 'Shireetharran.janakan', 'janakanpro@gmail.com', '0779298700', 'whatsapp', '', 0x726573756d655f363863613863336434623939345f4353543234332d335f4c345f5765625f546563686e6f6c6f676965735f666f725f52617069645f446576656c6f706d656e74202831292e706466, '2025-09-17 15:53:57'),
(3, 'janakan', 'sdmfksdnf@gmail.com', '0779298700', 'phone', 'jdsnfjsdnfsdf', NULL, '2025-09-17 15:04:39'),
(4, 'Shireetharran.janakan', 'janakanpro@gmail.com', '0779298700', 'whatsapp', '', 0x726573756d655f363863613862366138646438625f4353543234332d335f4c345f5765625f546563686e6f6c6f676965735f666f725f52617069645f446576656c6f706d656e74202832292e706466, '2025-09-17 15:50:26'),
(5, 'janakan', 'qwer@gmail.com', '0779298700', 'phone', '', 0x726573756d655f363863616364653036333837355f4c65637475726520352d496e74726f64756374696f6e20746f54726565732e706466, '2025-09-17 20:34:00');

-- --------------------------------------------------------

--
-- Table structure for table `job_posting`
--

CREATE TABLE `job_posting` (
  `job_id` int(11) NOT NULL,
  `provider_id` int(11) DEFAULT NULL,
  `admin_id` int(11) DEFAULT NULL,
  `title` varchar(200) NOT NULL,
  `description` text NOT NULL,
  `location` varchar(150) DEFAULT NULL,
  `job_type` enum('Full Time','Part Time','Internship') DEFAULT 'Full Time',
  `min_salary` int(10) NOT NULL,
  `max_salary` int(10) NOT NULL,
  `posting_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `expiry_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('active','closed','pending') DEFAULT 'pending',
  `is_approved` tinyint(1) DEFAULT 0,
  `requirements` text DEFAULT NULL,
  `benefits` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `job_posting`
--

INSERT INTO `job_posting` (`job_id`, `provider_id`, `admin_id`, `title`, `description`, `location`, `job_type`, `min_salary`, `max_salary`, `posting_date`, `expiry_date`, `status`, `is_approved`, `requirements`, `benefits`) VALUES
(1, 3, 2, 'Electrician Needed', 'Looking for experienced electrician for residential wiring.', 'New Town', 'Full Time', 1001, 3001, '2025-07-07 06:59:24', '2025-10-17 06:59:24', 'active', 1, 'Bachelor\'s degree in Computer Science or related field2+ years of experience in full-stack development', 'Competitive salary\n\nHealth insurance coverage\n\nFlexible working hours\n\nRemote work opportunities'),
(2, 3, 2, 'Part-time Plumber', 'Require plumber for on-call home services.', 'Greenfield', 'Part Time', 20000, 10000, '2025-07-07 06:59:24', '2025-08-27 06:59:24', 'active', 1, 'Familiarity with RESTful APIs and databases\n\nStrong problem-solving and communication skills', 'Health insurance coverage\n\nFlexible working hours\n\nRemote work opportunities\n\nProfessional development support (courses, conferences)\n\nFriendly and collaborative team environment'),
(3, 3, 2, 'Interior Designer', 'Need designer for multiple renovation projects.', 'Metro City', 'Internship', 35000, 20000, '2025-07-07 06:59:24', '2025-08-21 06:59:24', 'active', 0, 'Proficiency in JavaScript, React, and Node.js\n\nFamiliarity with RESTful APIs and databases', 'Health insurance coverage\n\nFlexible working hours\n\nRemote work opportunities\n\nProfessional development support (courses, conferences)\n\nFriendly and collaborative team environment'),
(4, 3, 2, 'HVAC Technician', 'Install and service air conditioning systems.', 'Downtown', 'Internship', 100000, 2000, '2025-07-07 06:59:24', '2025-10-23 06:59:24', 'active', 1, 'Familiarity with RESTful APIs and databases\n\nStrong problem-solving and communication skills', NULL),
(5, 3, NULL, 'helper', 'Looking for experienced electrician for residential wiring.', 'Mannar', 'Full Time', 24000, 342424234, '2025-07-29 08:36:44', '2025-10-15 18:30:00', 'active', 1, 'Bachelor&amp;amp;#039;s degree in Computer Science or related field2+ years of experience in full-stack development', 'Bachelor&amp;amp;#039;s degree in Computer Science or related field2+ years of experience in full-stack development'),
(6, 3, NULL, 'AC Technician', 'Looking for experienced electrician for residential wiring.', 'Vavuniya', 'Full Time', 5000, 765878, '2025-07-29 08:38:03', '2025-09-26 18:30:00', 'active', 0, 'Bachelor&amp;#039;s degree in Computer Science or related field2+ years of experience in full-stack development', 'Bachelor&amp;#039;s degree in Computer Science or related field2+ years of experience in full-stack development'),
(7, 3, NULL, 'Remote car Technician', 'Looking for experienced electrician for residential wiring.', 'Vavuniya', 'Full Time', 25000, 0, '2025-07-29 08:42:06', '2025-07-30 18:30:00', 'active', 0, 'kdsnsdngodkn', 'sldnodsngokdsngo');

-- --------------------------------------------------------

--
-- Table structure for table `maintenance_request_details`
--

CREATE TABLE `maintenance_request_details` (
  `request_id` int(11) NOT NULL,
  `device_condition` text DEFAULT NULL,
  `service_notes` text DEFAULT NULL,
  `last_maintenance_date` date DEFAULT NULL,
  `roof_height` decimal(5,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `message_id` int(11) NOT NULL,
  `chatSession_id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `receiver_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `messages`
--

INSERT INTO `messages` (`message_id`, `chatSession_id`, `sender_id`, `receiver_id`, `message`, `is_read`, `created_at`) VALUES
(11, 3, 3, 1, 'I need your help with something important', 0, '2025-09-05 14:37:16'),
(12, 3, 1, 3, 'Sure, whats going on? I\'m here to help', 0, '2025-09-05 14:37:16'),
(13, 3, 3, 1, 'Im planning a surprise party for Sarah this weekend', 0, '2025-09-05 14:37:16'),
(14, 3, 1, 3, 'Oh wow Thas awesome What do you need me to do', 0, '2025-09-05 14:37:16'),
(15, 3, 3, 1, 'Can you help with decorations and keep it secret', 0, '2025-09-05 14:37:16'),
(16, 3, 1, 3, 'Absolutely Im great at keeping secrets. When should I come over', 0, '2025-09-05 14:37:16'),
(17, 3, 3, 1, 'How about Saturday morning at 10 AM? Well have 3 hours before she gets home', 0, '2025-09-05 14:37:16'),
(18, 3, 1, 3, 'Perfect Ill bring balloons and streamers. Should I get a cake too', 0, '2025-09-05 14:37:16'),
(19, 3, 3, 1, 'Yes please! Chocolate is her favorite. Youre a lifesaver!', 0, '2025-09-05 14:37:16'),
(20, 3, 1, 3, 'No problem! This is going to be amazing. She\'ll be so surprised!', 0, '2025-09-05 14:37:16');

-- --------------------------------------------------------

--
-- Table structure for table `notification`
--

CREATE TABLE `notification` (
  `notification_id` int(11) NOT NULL,
  `reciver_id` int(11) NOT NULL,
  `user_type` enum('customer','service_provider','admin') NOT NULL,
  `title` varchar(200) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `sender_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `notification`
--

INSERT INTO `notification` (`notification_id`, `reciver_id`, `user_type`, `title`, `message`, `is_read`, `created_at`, `sender_id`) VALUES
(1, 1, 'customer', 'Order Confirmed', 'Your order #ORD123 has been confirmed.', 0, '2025-07-09 03:30:00', 2),
(2, 3, '', 'New Service Request', 'You have a new service request from MaryCustomer.', 0, '2025-07-09 04:45:00', 4),
(3, 5, 'customer', 'Payment Successful', 'Your payment of $49.99 has been received.', 0, '2025-07-08 11:00:00', 2),
(4, 6, '', 'Document Approved', 'Your uploaded certification has been approved.', 0, '2025-07-09 03:00:00', 7),
(5, 1, 'customer', 'Welcome!', 'Welcome to our platform, jana!', 0, '2025-07-09 06:15:00', 7),
(6, 1, 'customer', 'Request Accepted', 'Your contact request has been accepted by the service provider.', 1, '2025-07-16 03:30:23', 3),
(7, 1, 'service_provider', 'Request Accepted', 'Your contact request has been accepted.', 0, '2025-07-16 04:02:18', 3),
(8, 1, 'service_provider', 'Request Accepted', 'Your contact request has been accepted.', 0, '2025-07-17 03:42:02', 3),
(9, 1, 'service_provider', 'Request Accepted', 'Your contact request has been accepted.', 0, '2025-07-17 03:45:02', 3),
(10, 1, 'service_provider', 'Request Accepted', 'Your contact request has been accepted.', 0, '2025-07-17 03:49:59', 3),
(11, 4, 'service_provider', 'Request Accepted', 'Your contact request has been accepted.', 0, '2025-07-17 06:43:22', 3),
(12, 4, 'service_provider', 'Request Accepted', 'Your contact request has been accepted.', 0, '2025-07-21 11:52:43', 3),
(13, 1, 'service_provider', 'Request Accepted', 'Your contact request has been accepted.', 0, '2025-07-21 11:52:46', 3),
(14, 1, 'service_provider', 'Request Accepted', 'Your contact request has been accepted.', 0, '2025-07-25 11:09:47', 3),
(15, 1, 'service_provider', 'Request Accepted', 'Your contact request has been accepted.', 0, '2025-07-26 16:18:07', 3),
(16, 1, 'service_provider', 'Request Accepted', 'Your contact request has been accepted.', 0, '2025-07-26 16:18:12', 3),
(17, 1, 'service_provider', 'Request Accepted', 'Your contact request has been accepted.', 0, '2025-09-16 16:26:55', 3),
(18, 1, 'service_provider', 'Request Accepted', 'Your contact request has been accepted.', 0, '2025-09-19 09:54:20', 3),
(19, 1, 'service_provider', 'Request Accepted', 'Your contact request has been accepted.', 0, '2025-09-19 09:54:31', 3);

-- --------------------------------------------------------

--
-- Table structure for table `ongoing_project`
--

CREATE TABLE `ongoing_project` (
  `project_id` int(11) NOT NULL,
  `request_id` int(11) NOT NULL,
  `project_name` varchar(200) NOT NULL,
  `status` enum('new','ongoing','completed','terminated') DEFAULT 'new',
  `start_date` date DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `completed_date` date DEFAULT NULL,
  `payment_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `ongoing_project`
--

INSERT INTO `ongoing_project` (`project_id`, `request_id`, `project_name`, `status`, `start_date`, `due_date`, `completed_date`, `payment_id`, `created_at`, `updated_at`) VALUES
(1, 10, 'testing purpose', 'completed', '2025-09-04', '2025-09-26', NULL, NULL, '2025-09-16 05:04:20', '2025-09-16 08:17:22'),
(2, 13, 'JohnCustomer - Plumbing Repair', 'terminated', NULL, NULL, NULL, NULL, '2025-09-16 08:31:28', '2025-09-18 10:42:16'),
(3, 14, 'JohnCustomer -  Solar LED Garden Light', 'new', NULL, NULL, NULL, NULL, '2025-09-16 08:48:54', '2025-09-16 08:48:54'),
(4, 9, 'JohnCustomer - ABC', 'new', NULL, NULL, NULL, NULL, '2025-09-19 09:48:25', '2025-09-19 09:48:25');

-- --------------------------------------------------------

--
-- Table structure for table `order`
--

CREATE TABLE `order` (
  `order_id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `order_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `total_amount` decimal(10,2) DEFAULT NULL,
  `delivery_charge` decimal(10,2) DEFAULT NULL,
  `status` enum('pending','packed','on_transit','shipped','delivered') DEFAULT 'pending',
  `shipping_address` text DEFAULT NULL,
  `payment_status` enum('pending','paid','failed') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order`
--

INSERT INTO `order` (`order_id`, `customer_id`, `order_date`, `total_amount`, `delivery_charge`, `status`, `shipping_address`, `payment_status`, `created_at`, `updated_at`) VALUES
(2, 4, '2025-09-07 06:52:14', 1900.00, 300.00, 'pending', 'jaffna', 'pending', '2025-09-07 06:52:14', '2025-09-18 10:41:42'),
(3, 1, '2025-09-07 07:18:15', 21600.00, 300.00, '', 'jaffna', 'paid', '2025-09-07 07:18:15', '2025-09-18 19:24:40'),
(4, 1, '2025-09-07 17:28:35', 1100.00, 300.00, 'delivered', 'jaffna', 'paid', '2025-09-07 17:28:35', '2025-09-08 05:25:38'),
(5, 1, '2025-09-07 17:58:06', 1100.00, 300.00, '', 'jaffna', 'paid', '2025-09-07 17:58:06', '2025-09-13 05:05:26'),
(6, 1, '2025-09-07 18:37:02', 29600.00, 300.00, 'on_transit', 'jaffna', 'paid', '2025-09-07 18:37:02', '2025-09-18 19:52:45'),
(7, 1, '2025-09-08 05:28:04', 24700.00, 300.00, '', 'jaffna', 'paid', '2025-09-08 05:28:04', '2025-09-08 05:28:04'),
(8, 1, '2025-09-08 05:32:57', 1100.00, 300.00, '', 'jaffna', 'paid', '2025-09-08 05:32:57', '2025-09-08 05:32:57'),
(9, 1, '2025-09-08 05:34:24', 37300.00, 300.00, '', '36/2A 37 lane wellawatte , Western, Colombo', 'paid', '2025-09-08 05:34:24', '2025-09-08 05:34:24'),
(10, 1, '2025-09-08 05:42:32', 1100.00, 300.00, '', 'jsdfosdf, Central, Kandy', 'paid', '2025-09-08 05:42:32', '2025-09-08 05:42:32'),
(11, 1, '2025-09-08 06:00:55', 1100.00, 300.00, '', 'jsdfosdf, Central, Kandy', 'paid', '2025-09-08 06:00:55', '2025-09-19 03:57:51');

-- --------------------------------------------------------

--
-- Table structure for table `order_item`
--

CREATE TABLE `order_item` (
  `item_id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(10,2) DEFAULT NULL,
  `subtotal` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_item`
--

INSERT INTO `order_item` (`item_id`, `order_id`, `product_id`, `quantity`, `unit_price`, `subtotal`) VALUES
(2, 2, 16, 2, 800.00, 1600.00),
(3, 3, 16, 1, 800.00, 800.00),
(4, 3, 11, 1, 8000.00, 8000.00),
(5, 3, 9, 1, 12500.00, 12500.00),
(6, 4, 16, 1, 800.00, 800.00),
(7, 5, 16, 1, 800.00, 800.00),
(8, 6, 11, 2, 8000.00, 16000.00),
(9, 6, 16, 1, 800.00, 800.00),
(10, 6, 9, 1, 12500.00, 12500.00),
(11, 7, 16, 1, 800.00, 800.00),
(12, 7, 9, 1, 12500.00, 12500.00),
(13, 7, 10, 3, 3700.00, 11100.00),
(14, 8, 16, 1, 800.00, 800.00),
(15, 9, 16, 1, 800.00, 800.00),
(16, 9, 11, 1, 8000.00, 8000.00),
(17, 9, 9, 1, 12500.00, 12500.00),
(18, 9, 10, 1, 3700.00, 3700.00),
(19, 9, 17, 1, 12000.00, 12000.00),
(20, 10, 16, 1, 800.00, 800.00),
(21, 11, 16, 1, 800.00, 800.00);

-- --------------------------------------------------------

--
-- Table structure for table `payment`
--

CREATE TABLE `payment` (
  `payment_id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `payment_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `payment_method` enum('cod','card') NOT NULL,
  `transaction_id` varchar(100) DEFAULT NULL,
  `status` enum('pending','completed','failed') DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payment`
--

INSERT INTO `payment` (`payment_id`, `order_id`, `customer_id`, `amount`, `payment_date`, `payment_method`, `transaction_id`, `status`) VALUES
(1, 2, 1, 1900.00, '2025-09-07 06:52:14', '', 'TXN_1757227934_2', 'completed'),
(2, 3, 1, 21600.00, '2025-09-07 07:18:15', '', 'TXN_1757229495_3', 'completed'),
(3, 4, 1, 1100.00, '2025-09-07 17:28:35', '', 'TXN_1757266115_4', 'completed'),
(4, 5, 1, 1100.00, '2025-09-07 17:58:06', '', 'TXN_1757267886_5', 'completed'),
(5, 6, 1, 29600.00, '2025-09-07 18:37:02', '', 'TXN_1757270222_6', 'completed'),
(6, 7, 1, 24700.00, '2025-09-08 05:28:04', '', 'TXN_1757309284_7', 'completed'),
(7, 8, 1, 1100.00, '2025-09-08 05:32:57', '', 'TXN_1757309577_8', 'completed'),
(8, 9, 1, 37300.00, '2025-09-08 05:34:24', '', 'TXN_1757309664_9', 'completed'),
(9, 10, 1, 1100.00, '2025-09-08 05:42:32', '', 'TXN_1757310152_10', 'completed'),
(10, 11, 1, 1100.00, '2025-09-08 06:00:55', '', NULL, 'pending');

-- --------------------------------------------------------

--
-- Table structure for table `product`
--

CREATE TABLE `product` (
  `product_id` int(11) NOT NULL,
  `provider_id` int(11) DEFAULT NULL,
  `name` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `images` text CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `specifications` varchar(200) DEFAULT NULL,
  `is_approved` tinyint(1) DEFAULT 0,
  `is_delete` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `product`
--

INSERT INTO `product` (`product_id`, `provider_id`, `name`, `description`, `price`, `category`, `images`, `specifications`, `is_approved`, `is_delete`, `created_at`, `updated_at`) VALUES
(2, 0, 'LED Bulb Packs', 'Energy-efficient LED bulbs (Pack of 5).', 1200.00, 'Lighting', 'uploads/1758269387_images.jpg', '9W, Cool White, B22 Base', 1, 0, '2025-07-07 06:57:56', '2025-09-19 10:51:14'),
(7, 3, 'AMBERT mini solar', 'solar panel', 4500.00, 'solar', 'uploads/solar12.jpg', NULL, 1, 0, '2025-07-11 10:12:36', '2025-09-12 05:34:33'),
(9, 3, 'mini solar X3', 'solar panel', 12500.00, 'solar', 'uploads/solar10.avif', NULL, 1, 0, '2025-07-11 10:23:29', '2025-09-12 05:30:26'),
(10, 3, 'Spin LED E27-4W', 'bulb', 3700.00, '', 'uploads/bulb3.jpg', '', 1, 0, '2025-07-11 10:28:27', '2025-09-12 05:30:31'),
(11, 3, 'mini panels', '', 8000.00, 'AWT-23', 'uploads/solar4.jpg', '', 1, 0, '2025-07-21 07:52:25', '2025-09-12 05:30:34'),
(14, 3, 'wire', 'connecting wire#123', 2400.00, '', 'uploads/wires.jpg', '', 1, 0, '2025-07-21 08:07:55', '2025-09-12 05:30:37'),
(16, 3, 'LED Light-AQARA', 'bulb', 800.00, 'mini bulbs', 'uploads/bulb2.jpg', '', 1, 0, '2025-07-21 08:12:26', '2025-09-12 05:30:45'),
(17, 3, 'panel', 'small solar x-20', 12000.00, 'panel', 'uploads/solar9.jpg', '', 0, 0, '2025-07-21 09:11:50', '2025-09-12 08:59:11'),
(18, 3, 'qwertyu', 'wertyuiop', 99999999.99, 'qwertyuio', 'uploads/1757667287_paypal.JPG', '123456wertyuio', 0, 1, '2025-09-12 08:54:47', '2025-09-16 09:34:35'),
(19, 3, 'ksdfokdsnfko', 'SLDFNLKDSNFSLDNFLS', 234324.00, 'LDKASLMLDSKA', 'uploads/1758015102_masterCard.JPG', 'SDKMFNKDSNFSDNF', 0, 1, '2025-09-16 09:31:42', '2025-09-16 09:34:24'),
(20, 57, 'SOLAX mini solar', 'Energy-efficient LED bulbs (Pack of 5).', 4500.00, 'solar', 'uploads/1758170989_ring.jpg', '9W, Cool White, B22 Base9W, Cool White, B22 Base9W, Cool White, B22 Base9W, Cool White, B22 Base9W, Cool White, B22 Base9W, Cool White, B22 Base\r\n9W, Cool White, B22 Base\r\n9W, Cool White, B22 Base\r\n9W', 1, 0, '2025-09-18 04:49:49', '2025-09-18 04:50:40'),
(21, 3, 'SolaX X1-AE-7KW', 'Charging Station', 4490.00, 'charger', 'uploads/1758269658_images1.jpg', 'charging', 0, 0, '2025-09-19 08:14:18', '2025-09-19 08:14:18');

-- --------------------------------------------------------

--
-- Table structure for table `qa`
--

CREATE TABLE `qa` (
  `qa_id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `responcer_id` int(11) DEFAULT NULL,
  `email` varchar(150) DEFAULT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `subject` varchar(100) NOT NULL,
  `question` text NOT NULL,
  `question_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `answer` text DEFAULT NULL,
  `answer_date` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `qa`
--

INSERT INTO `qa` (`qa_id`, `customer_id`, `responcer_id`, `email`, `full_name`, `subject`, `question`, `question_date`, `answer`, `answer_date`, `created_at`) VALUES
(1, NULL, 3, 'abcd@gmail.com', 'janakan', 'examing', 'what is ur name?', '2025-09-19 04:35:25', 'kfmgkmgk', '2025-09-19 05:09:27', '2025-09-19 04:35:25'),
(2, NULL, NULL, 'jakana', '1', '27247single@gmail.com', 'kldsmfkldm', '2025-09-19 05:37:29', NULL, NULL, '2025-09-19 05:37:29');

-- --------------------------------------------------------

--
-- Table structure for table `relocated_request`
--

CREATE TABLE `relocated_request` (
  `request_id` int(11) NOT NULL,
  `current_address` text DEFAULT NULL,
  `new_address` text DEFAULT NULL,
  `current_roof_height` decimal(5,2) DEFAULT NULL,
  `new_roof_height` decimal(5,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `relocated_request`
--

INSERT INTO `relocated_request` (`request_id`, `current_address`, `new_address`, `current_roof_height`, `new_roof_height`) VALUES
(10, 'jaffna', 'colombo', 12.00, 4.00),
(14, 'https://t.me/+vgCsGC6zZek2YjVl, Kandy, Central, 2341324', 'abc, Matale, Central, 876', 0.00, 31.00);

-- --------------------------------------------------------

--
-- Table structure for table `review`
--

CREATE TABLE `review` (
  `review_id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `product_id` int(11) DEFAULT NULL,
  `service_id` int(11) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL CHECK (`rating` between 1 and 5),
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_approved` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `review`
--

INSERT INTO `review` (`review_id`, `customer_id`, `product_id`, `service_id`, `rating`, `comment`, `created_at`, `updated_at`, `is_approved`) VALUES
(3, 3, 7, NULL, 5, 'Excellent brightness and value for money.', '2025-07-20 14:19:01', '2025-07-20 14:21:47', 1),
(4, 3, 9, NULL, 4, 'Good quality LED bulbs, recommended.', '2025-07-20 14:19:01', '2025-07-20 14:21:47', 1),
(5, 56, 2, NULL, 5, 'Best bulbs I’ve used. Great energy efficiency.', '2025-07-20 14:19:01', '2025-09-18 04:03:37', 1),
(7, 3, 10, NULL, 5, 'Excellent brightness and value for money.', '2025-07-20 14:19:35', '2025-07-20 14:21:47', 1),
(8, 54, 2, NULL, 4, 'Good quality LED bulbs, recommended.', '2025-07-20 14:19:35', '2025-07-20 14:21:47', 1),
(9, 1, 2, NULL, 5, 'Best bulbs I?ve used. Great energy efficiency.', '2025-07-20 14:19:35', '2025-07-20 14:21:47', 1),
(17, 56, 19, NULL, 3, 'Best bulbs I?ve used. Great energy efficiency.', '2025-09-18 03:55:59', '2025-09-18 03:58:42', 0),
(18, 1, 2, NULL, 2, 'Best bulbs I?ve used. Great energy efficiency.', '2025-09-18 03:56:41', '2025-09-18 03:58:47', 0),
(19, 56, 2, NULL, 5, 'Best bulbs I?ve used. Great energy efficiency.', '2025-09-18 03:56:41', '2025-09-18 03:58:52', 0),
(20, 56, 2, NULL, 1, 'Best bulbs I?ve used. Great energy efficiency.', '2025-09-18 03:57:07', '2025-09-18 03:58:54', 0),
(21, 56, 2, NULL, 3, 'Best bulbs I?ve used. Great energy efficiency.', '2025-09-18 03:57:07', '2025-09-18 03:59:09', 0);

-- --------------------------------------------------------

--
-- Table structure for table `service`
--

CREATE TABLE `service` (
  `service_id` int(11) NOT NULL,
  `provider_id` int(11) DEFAULT NULL,
  `name` varchar(150) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `category` enum('installation','relocation','maintenance') NOT NULL DEFAULT 'installation',
  `is_approved` tinyint(1) DEFAULT 0,
  `is_active` tinyint(4) NOT NULL DEFAULT 1,
  `is_delete` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `service`
--

INSERT INTO `service` (`service_id`, `provider_id`, `name`, `description`, `price`, `category`, `is_approved`, `is_active`, `is_delete`, `created_at`, `updated_at`) VALUES
(1, 3, 'AC Installation1', 'Professional air conditioner installation service.', 175.00, 'maintenance', 0, 0, 0, '2025-07-07 06:58:40', '2025-09-18 06:47:57'),
(2, 3, 'Plumbing Repair', 'Fix leaks, clogs, and other plumbing issues.', 40.00, 'maintenance', 1, 1, 1, '2025-07-07 06:58:40', '2025-09-13 13:00:54'),
(3, 3, 'Interior Painting', 'Wall painting service for homes and offices.', 150.00, 'maintenance', 1, 1, 1, '2025-07-07 06:58:40', '2025-09-13 11:38:42'),
(4, 3, 'Home Cleaning', 'Deep cleaning for residential spaces.', 100.00, 'maintenance', 1, 0, 0, '2025-07-07 06:58:40', '2025-09-18 10:43:51'),
(5, 3, 'ABC', 'Wall painting service for homes and offices.', 100.00, 'relocation', 1, 0, 0, '2025-07-18 19:07:08', '2025-09-18 10:43:53'),
(7, 3, ' Solar LED Garden Light', 'Wall painting service for homes and offices.', 121.00, 'relocation', 1, 0, 0, '2025-07-28 12:14:56', '2025-09-18 10:43:58'),
(8, 3, 'SOLAR Installation', 'Wall painting service for homes and offices.', 232.00, 'maintenance', 1, 0, 0, '2025-07-28 12:15:24', '2025-09-18 10:43:56'),
(9, 3, 'AC Installation1', 'Deep cleaning for residential spaces.', 342.00, 'installation', 1, 0, 0, '2025-07-28 12:23:11', '2025-09-18 10:43:55'),
(11, 3, 'moter cycle Installation1', 'Wall painting service for homes and offices.', 99999999.99, 'maintenance', 0, 0, 0, '2025-07-28 14:08:35', '2025-09-18 10:43:59'),
(13, 3, 'Radio Installation1', 'Deep cleaning for residential spaces.', 99999999.99, 'installation', 0, 0, 0, '2025-09-13 07:38:18', '2025-09-18 10:44:01'),
(14, 3, 'TV Installation', 'Wall painting service for homes and offices.', 234324.00, 'maintenance', 0, 0, 0, '2025-09-16 04:28:19', '2025-09-18 10:44:03');

-- --------------------------------------------------------

--
-- Table structure for table `service_payment`
--

CREATE TABLE `service_payment` (
  `payment_id` int(11) NOT NULL,
  `request_id` int(11) DEFAULT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `payment_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `payment_method` enum('cash on delivery','card payment') NOT NULL,
  `transaction_id` varchar(100) DEFAULT NULL,
  `status` enum('pending','completed','failed') DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `service_provider`
--

CREATE TABLE `service_provider` (
  `provider_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `contact_number` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `district` varchar(100) DEFAULT NULL,
  `profile_image` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `company_name` varchar(150) DEFAULT NULL,
  `business_registration_number` varchar(100) DEFAULT NULL,
  `company_description` text DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `verification_status` enum('pending','verified','rejected') DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `service_provider`
--

INSERT INTO `service_provider` (`provider_id`, `user_id`, `contact_number`, `address`, `district`, `profile_image`, `company_name`, `business_registration_number`, `company_description`, `website`, `verification_status`) VALUES
(3, 3, '1234567890', 'wertyuio', 'jaffna', 'uploads/abisajan.jpg', 'solax PVT', NULL, NULL, NULL, 'pending'),
(12, 57, '0779298700', 'werty', 'Badulla', NULL, 'Solax PVT', 'BR123456', 'wertyuiWERTYUIO qwertyui qwertyu', 'https://www.daraz.lk/#hp-flash-sale', 'pending');

-- --------------------------------------------------------

--
-- Table structure for table `service_request`
--

CREATE TABLE `service_request` (
  `request_id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `service_id` int(11) DEFAULT NULL,
  `request_date` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('pending','accepted','rejected','completed') DEFAULT 'pending',
  `payment_status` enum('pending','paid') DEFAULT 'pending',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `service_type` enum('installation','relocation','maintenance') DEFAULT 'installation'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `service_request`
--

INSERT INTO `service_request` (`request_id`, `customer_id`, `service_id`, `request_date`, `status`, `payment_status`, `created_at`, `updated_at`, `service_type`) VALUES
(9, 1, 5, '2025-07-23 07:18:55', 'accepted', 'pending', '2025-07-23 07:18:55', '2025-09-19 09:48:25', NULL),
(10, 1, 5, '2025-07-23 07:28:09', 'accepted', 'pending', '2025-07-23 07:28:09', '2025-09-14 05:44:23', NULL),
(11, 1, 5, '2025-07-23 07:29:36', 'pending', 'pending', '2025-07-23 07:29:36', '2025-09-18 20:11:54', NULL),
(13, 1, 2, '2025-07-23 08:48:23', 'accepted', 'pending', '2025-07-23 08:48:23', '2025-09-16 08:31:28', NULL),
(14, 1, 7, '2025-09-13 12:55:54', 'accepted', 'pending', '2025-09-13 12:55:54', '2025-09-16 08:48:54', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `service_review`
--

CREATE TABLE `service_review` (
  `review_id` int(11) NOT NULL,
  `customer_id` int(11) DEFAULT NULL,
  `service_id` int(11) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL,
  `comment` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `is_approved` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `service_review`
--

INSERT INTO `service_review` (`review_id`, `customer_id`, `service_id`, `rating`, `comment`, `created_at`, `updated_at`, `is_approved`) VALUES
(16, 1, 1, 5, 'Fantastic service! Arrived on time and completed the job quickly.', '2025-07-22 16:49:18', '2025-07-22 16:49:18', 1),
(17, 2, 1, 4, 'Good quality work, but a bit expensive.', '2025-07-22 16:49:18', '2025-07-22 16:49:18', 1),
(18, 3, 1, 5, 'Highly recommended. Professional and courteous.', '2025-07-22 16:49:18', '2025-07-22 16:49:18', 1),
(19, 4, 2, 3, 'Average experience, some delays in communication.', '2025-07-22 16:49:18', '2025-07-22 16:49:18', 1),
(20, 5, 2, 4, 'Helpful and efficient team. Would hire again.', '2025-07-22 16:49:18', '2025-07-22 16:49:18', 1),
(21, 1, 2, 2, 'Service wasn’t as expected. Needs improvement.', '2025-07-22 16:49:18', '2025-07-22 16:49:18', 1),
(22, 2, 4, 5, 'Outstanding support and quick resolution.', '2025-07-22 16:49:18', '2025-07-22 16:49:18', 1),
(23, 3, 3, 4, 'Smooth booking process and good results.', '2025-07-22 16:49:18', '2025-07-22 16:49:18', 1),
(24, 3, 3, 5, 'Excellent service overall. Very satisfied!', '2025-07-22 16:49:18', '2025-07-22 16:49:18', 1),
(25, 5, 4, 4, 'Service met my expectations.', '2025-07-22 16:49:18', '2025-07-22 16:49:18', 1);

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `user_id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `email_verified` enum('0','1') DEFAULT '0',
  `password` varchar(255) NOT NULL,
  `is_blocked` tinyint(1) NOT NULL DEFAULT 0,
  `user_role` enum('customer','service_provider','admin') NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `username`, `email`, `email_verified`, `password`, `is_blocked`, `user_role`, `created_at`, `updated_at`) VALUES
(1, 'JohnCustomer', 'customer1@gmail.com', '0', '1010', 0, 'customer', '2024-07-05 06:41:48', '2025-09-18 04:35:56'),
(2, 'AliceAdmin', 'admin1@gmail.com', '0', '1010', 0, 'admin', '2024-07-05 06:41:48', '2025-09-18 04:35:15'),
(3, 'JohnProvider', 'provider1@gmail.com', '0', '1010', 1, 'service_provider', '2024-07-05 06:41:48', '2025-09-19 10:50:33'),
(56, 'janakan', 'provider21@gmail.com', '1', '@Abcd1234', 0, 'customer', '2025-09-17 13:41:35', '2025-09-18 04:36:05'),
(57, 'jana', 'jana123@gmail.com', '0', '@Abcd1234', 0, 'service_provider', '2025-09-18 04:47:14', '2025-09-19 10:51:39');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`admin_id`),
  ADD KEY `fk_user_id_2` (`user_id`);

--
-- Indexes for table `blog`
--
ALTER TABLE `blog`
  ADD PRIMARY KEY (`blog_id`),
  ADD KEY `admin_id` (`admin_id`);

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`cart_id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `cart_item`
--
ALTER TABLE `cart_item`
  ADD PRIMARY KEY (`item_id`),
  ADD KEY `cart_id` (`cart_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `chat_message`
--
ALTER TABLE `chat_message`
  ADD PRIMARY KEY (`message_id`);

--
-- Indexes for table `chat_sessions`
--
ALTER TABLE `chat_sessions`
  ADD PRIMARY KEY (`message_id`),
  ADD KEY `conversation_id` (`chatSession_id`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `receiver_id` (`receiver_id`);

--
-- Indexes for table `contact_request`
--
ALTER TABLE `contact_request`
  ADD PRIMARY KEY (`contact_id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `provider_id` (`provider_id`),
  ADD KEY `service_id` (`service_id`);

--
-- Indexes for table `conversation`
--
ALTER TABLE `conversation`
  ADD PRIMARY KEY (`chatSession_id`),
  ADD UNIQUE KEY `request_id` (`request_id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `provider_id` (`provider_id`);

--
-- Indexes for table `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`customer_id`),
  ADD KEY `fk_user_id` (`user_id`);

--
-- Indexes for table `installation_request`
--
ALTER TABLE `installation_request`
  ADD PRIMARY KEY (`request_id`);

--
-- Indexes for table `jobapply`
--
ALTER TABLE `jobapply`
  ADD PRIMARY KEY (`jobId`);

--
-- Indexes for table `job_posting`
--
ALTER TABLE `job_posting`
  ADD PRIMARY KEY (`job_id`),
  ADD KEY `provider_id` (`provider_id`),
  ADD KEY `admin_id` (`admin_id`);

--
-- Indexes for table `maintenance_request_details`
--
ALTER TABLE `maintenance_request_details`
  ADD PRIMARY KEY (`request_id`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`message_id`),
  ADD KEY `chatSession_id` (`chatSession_id`),
  ADD KEY `sender_id` (`sender_id`),
  ADD KEY `receiver_id` (`receiver_id`);

--
-- Indexes for table `notification`
--
ALTER TABLE `notification`
  ADD PRIMARY KEY (`notification_id`),
  ADD KEY `user_id` (`reciver_id`);

--
-- Indexes for table `ongoing_project`
--
ALTER TABLE `ongoing_project`
  ADD PRIMARY KEY (`project_id`),
  ADD KEY `fk_project_request` (`request_id`),
  ADD KEY `fk_project_payment` (`payment_id`);

--
-- Indexes for table `order`
--
ALTER TABLE `order`
  ADD PRIMARY KEY (`order_id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `order_item`
--
ALTER TABLE `order_item`
  ADD PRIMARY KEY (`item_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `payment`
--
ALTER TABLE `payment`
  ADD PRIMARY KEY (`payment_id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`product_id`),
  ADD KEY `provider_id` (`provider_id`);

--
-- Indexes for table `qa`
--
ALTER TABLE `qa`
  ADD PRIMARY KEY (`qa_id`),
  ADD KEY `admin_id` (`responcer_id`),
  ADD KEY `qa_ibfk_1` (`customer_id`);

--
-- Indexes for table `relocated_request`
--
ALTER TABLE `relocated_request`
  ADD PRIMARY KEY (`request_id`);

--
-- Indexes for table `review`
--
ALTER TABLE `review`
  ADD PRIMARY KEY (`review_id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `product_id` (`product_id`),
  ADD KEY `review_ibfk_3` (`service_id`);

--
-- Indexes for table `service`
--
ALTER TABLE `service`
  ADD PRIMARY KEY (`service_id`),
  ADD KEY `provider_id` (`provider_id`);

--
-- Indexes for table `service_payment`
--
ALTER TABLE `service_payment`
  ADD PRIMARY KEY (`payment_id`),
  ADD KEY `request_id` (`request_id`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `service_provider`
--
ALTER TABLE `service_provider`
  ADD PRIMARY KEY (`provider_id`),
  ADD KEY `fk_user_id_1` (`user_id`);

--
-- Indexes for table `service_request`
--
ALTER TABLE `service_request`
  ADD PRIMARY KEY (`request_id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `service_id` (`service_id`) USING BTREE;

--
-- Indexes for table `service_review`
--
ALTER TABLE `service_review`
  ADD PRIMARY KEY (`review_id`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `service_id` (`service_id`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `unique_email_role` (`email`,`user_role`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `blog`
--
ALTER TABLE `blog`
  MODIFY `blog_id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `cart_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `cart_item`
--
ALTER TABLE `cart_item`
  MODIFY `item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- AUTO_INCREMENT for table `chat_message`
--
ALTER TABLE `chat_message`
  MODIFY `message_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `chat_sessions`
--
ALTER TABLE `chat_sessions`
  MODIFY `message_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `contact_request`
--
ALTER TABLE `contact_request`
  MODIFY `contact_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `conversation`
--
ALTER TABLE `conversation`
  MODIFY `chatSession_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `customer`
--
ALTER TABLE `customer`
  MODIFY `customer_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `job_posting`
--
ALTER TABLE `job_posting`
  MODIFY `job_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `message_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `notification`
--
ALTER TABLE `notification`
  MODIFY `notification_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `ongoing_project`
--
ALTER TABLE `ongoing_project`
  MODIFY `project_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `order`
--
ALTER TABLE `order`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `order_item`
--
ALTER TABLE `order_item`
  MODIFY `item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=30;

--
-- AUTO_INCREMENT for table `payment`
--
ALTER TABLE `payment`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `product`
--
ALTER TABLE `product`
  MODIFY `product_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `qa`
--
ALTER TABLE `qa`
  MODIFY `qa_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `review`
--
ALTER TABLE `review`
  MODIFY `review_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `service`
--
ALTER TABLE `service`
  MODIFY `service_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `service_payment`
--
ALTER TABLE `service_payment`
  MODIFY `payment_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `service_provider`
--
ALTER TABLE `service_provider`
  MODIFY `provider_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `service_request`
--
ALTER TABLE `service_request`
  MODIFY `request_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `service_review`
--
ALTER TABLE `service_review`
  MODIFY `review_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=58;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `admin`
--
ALTER TABLE `admin`
  ADD CONSTRAINT `admin_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_user_id_2` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`);

--
-- Constraints for table `cart_item`
--
ALTER TABLE `cart_item`
  ADD CONSTRAINT `cart_item_ibfk_1` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`cart_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `cart_item_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
