require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");
const Availability = require("../models/Availability");
const Category = require("../models/Category");
const Portfolio = require("../models/Portfolio");
const ProviderProfile = require("../models/ProviderProfile");
const User = require("../models/User");
const normalizePhone = require("../utils/normalizePhone");
const slugify = require("../utils/slugify");

const categoryDetails = {
  Electrician: {
    icon: "electrical_services",
    description: "Electrical wiring, repairs, lighting, inverter, and home power services."
  },
  "Hair & Beauty": {
    icon: "content_cut",
    description: "Salon, grooming, hair care, makeup, and beauty services."
  },
  Mechanic: {
    icon: "build",
    description: "Car, bike, engine, battery, AC, and doorstep vehicle repair services."
  },
  "Puncture & Tyre": {
    icon: "tire_repair",
    description: "Puncture repair, tyre fitting, air filling, balancing, and roadside tyre help."
  }
};

const areaCoordinates = {
  Karond: [77.4098, 23.2966],
  Lalgati: [77.4224, 23.2872],
  Gandhinagar: [77.3389, 23.2841]
};

const providerRows = `
BPL023|Electrician|Bijli Babu Electric|Rakesh Bijlani|+91 94252 43456|bijlibabu.karond@gmail.com|14, Karond Main|Karond|Bhopal|462038|4.8|456|16|150|2500|Wiring, Fan, MCB repair|Experienced electrician on Karond Main Road for wiring, fan fitting, and MCB repairs.
BPL024|Electrician|Lalgati Electric|Sundar Singh|+91 98251 54567|lalgatielectric@gmail.com|10, Near Lalgati|Lalgati|Bhopal|462001|4.6|298|12|200|3000|Inverter setup, Earthing, Switchboard|Inverter setup, earthing solutions, and switchboard installation near Lalgati Masjid.
BPL025|Electrician|Gandhi Nagar Electricals|Kuldeep Pathak|+91 97552 65678|gnelectricals.bpl@gmail.com|3, Gandhi Nagar|Gandhinagar|Bhopal|462001|4.7|367|14|200|4000|Solar setup, CCTV wiring, Smart home|Solar panel installation, CCTV wiring, and smart home automation at Gandhi Nagar Tiraha.
BPL026|Electrician|Sharma Electric|Om Prakash|+91 91662 76789|sharma.electric.karond@gmail.com|Shop 7, Karond|Karond|Bhopal|462038|4.5|213|10|150|2000|AC wiring, DB setup, Light fitting|AC power lines, distribution board setup, and light fitting in Karond Colony.
BPL027|Electrician|Current Solutions|Firoz Khan|+91 88902 87890|currentsolutions.lalgati@gmail.com|Near Lalgati|Lalgati|Bhopal|462001|4.4|167|8|120|1800|Short circuit, Meter installation, Cable laying|Short circuit repair, meter installation, and cable laying near Lalgati Chowk.
BPL028|Electrician|VoltCare Services|Ankit Tripathi|+91 96302 98901|voltcare.gandhinagar@gmail.com|21, Gandhi Nagar|Gandhinagar|Bhopal|462001|4.6|289|11|180|3500|Generator, UPS, Three phase|Generator servicing, UPS installation, and three-phase electrical work in Gandhi Nagar.
BPL029|Electrician|Power House|Kailash Yadav|+91 94072 09012|powerhouse.karond@gmail.com|Near Karond|Karond|Bhopal|462038|4.3|124|7|100|1500|Switchboard, RCD, Safety audit|Switchboard, RCD installation, and home electrical safety audits near Karond High School.
BPL030|Electrician|Jyoti Electrical|Jyoti Prasad|+91 99262 10123|jyotielectrical.lalgati@gmail.com|12, Lalgati Housing|Lalgati|Bhopal|462001|4.7|334|15|150|2800|Full house wiring, LED panel, Ceiling fan|Full house wiring, LED panel setup, and ceiling fan repair in Lalgati Housing Board area.
BPL031|Electrician|Spark Zone|Neeraj Malhotra|+91 90092 21234|sparkzone.gandhinagar@gmail.com|5, Near Gandhi Nagar|Gandhinagar|Bhopal|462001|4.5|198|9|150|2200|Facade lighting, LED lighting, Home lighting|LED and facade lighting specialist near Gandhi Nagar Park for homes and shops.
BPL032|Electrician|Reliable Wireman|Suresh Viswas|+91 77552 32345|reliable.wireman.karond@gmail.com|Karond Bazar|Karond|Bhopal|462038|4.4|156|8|100|1200|Socket repair, Fuse box, Small wiring|Socket and fuse box repair near Karond Temple. Handles home and small shop wiring.
BPL033|Electrician|Laxmi Electric|Laxmi Narayan|+91 93401 43456|laxmi.electric.lalgati@gmail.com|Lalgati Market|Lalgati|Bhopal|462001|4.5|178|10|120|1800|Wiring, Switches, Inverter service|Lalgati Market electrical supplies shop offering wiring and inverter services.
BPL034|Electrician|EasyFix Electricals|Harshit Pandey|+91 91663 54567|easyfix.gandhinagar@gmail.com|Gandhi Nagar|Gandhinagar|Bhopal|462001|4.3|109|6|100|1400|Light repair, Fan repair, Meter boxes|Affordable home electrical service on Gandhi Nagar Road 3 for lights, fans, and meter boxes.
BPL001|Hair & Beauty|Rajesh Hair|Rajesh Patel|+91 94250 11234|rajesh.hairstudio@gmail.com|Shop 4, Karond|Karond|Bhopal|462038|4.6|187|9|80|400|Haircut, Beard, Hair color|Popular men's salon at Karond Chowk offering modern cuts, beard styling, and hair color.
BPL002|Hair & Beauty|Suman Beauty|Suman Verma|+91 98930 22345|suman.beauty.karond@gmail.com|18, Near Karond|Karond|Bhopal|462038|4.7|241|11|150|1200|Facial, Threading, Wedding makeup|Trusted women's parlour near Karond Bus Stand for facials, threading, and wedding makeup.
BPL003|Hair & Beauty|Preethi Salon|Preethi Sharma|+91 93010 33456|preethi.salon.bpl@gmail.com|22, Ganesh Nagar|Karond|Bhopal|462038|4.4|112|6|100|800|Keratin, Hair spa, Waxing|Specialist in keratin treatments, hair spa, and full body waxing services.
BPL004|Hair & Beauty|Noor Beauty|Noor Fatima|+91 97550 44567|noor.beauty.lalgati@gmail.com|7, Lalgati Main|Lalgati|Bhopal|462001|4.8|329|13|200|2000|Bridal makeup, Mehndi, Party makeup|Renowned bridal studio at Lalgati offering full bridal packages with mehndi and makeup.
BPL005|Hair & Beauty|Classic Cuts|Vivek Yadav|+91 91660 55678|classiccuts.gandhinagar@gmail.com|3, Gandhi Nagar|Gandhinagar|Bhopal|462001|4.5|198|8|80|350|Haircut, Shave, Classic cuts|Old-school barbershop at Gandhi Nagar Square with hot towel shaves and classic cuts.
BPL006|Hair & Beauty|Glam Zone Parlour|Ritu Singh|+91 88900 66789|glamzone.gandhinagar@gmail.com|15, Near Gandhi Nagar|Gandhinagar|Bhopal|462001|4.6|267|10|120|1500|Facial, Pedicure, Nail art|Glam Zone offers pedicures, nail art, facials, and skin care for women near Gandhi Nagar PO.
BPL007|Hair & Beauty|Shine Hair Studio|Arun Kushwaha|+91 96300 77890|shinehair.lalgati@gmail.com|11, Lalgati Bazaar|Lalgati|Bhopal|462001|4.3|89|5|60|300|Haircut, Hair color, Basic hair care|Affordable hair studio in Lalgati Bazaar for men and kids cuts and basic hair color.
BPL008|Hair & Beauty|Apsara Beauty|Kavita Thakur|+91 94070 88901|apsara.beauty.karond@gmail.com|Shop 9, Karond|Karond|Bhopal|462038|4.7|312|14|150|1800|Bridal makeup, Party makeup, Beauty care|Established beauty centre at Karond Market with a speciality in bridal and party makeup.
BPL009|Hair & Beauty|Trendy Cuts|Mohit Chouhan|+91 99260 99012|trendycuts.gandhinagar@gmail.com|28, Shyam Nagar|Gandhinagar|Bhopal|462001|4.4|143|7|100|500|Highlights, Smoothening, Hair treatments|Trendy unisex salon in Shyam Nagar for highlights, smoothening, and hair treatments.
BPL010|Hair & Beauty|Rupali Beauty|Rupali Jain|+91 90090 10123|rupali.salon.lalgati@gmail.com|5, Nehru Nagar|Lalgati|Bhopal|462001|4.5|176|9|100|900|Waxing, Threading, Grooming|Neat women's salon in Nehru Nagar, Lalgati for grooming and skin care.
BPL011|Hair & Beauty|Smart Look|Deepak Rathore|+91 77550 21234|smartlook.karond@gmail.com|Near Karond Petrol Pump|Karond|Bhopal|462038|4.2|67|4|60|280|Haircut, Shave, Beard shaping|Budget-friendly salon near Karond Petrol Pump for quick cuts, shaves, and beard shaping.
BPL012|Hair & Beauty|Pari Parlour|Pari Bai|+91 93400 32345|pari.parlour.gandhinagar@gmail.com|16, Gandhi Nagar|Gandhinagar|Bhopal|462001|4.6|221|12|100|1000|Mehndi, Makeup, Facials|Experienced parlour in Gandhi Nagar Colony known for mehndi designs, makeup, and facials.
BPL035|Mechanic|Karond Auto|Vijay Singh Yadav|+91 94253 65678|karond.auto@gmail.com|Opposite Karond Bus Depot|Karond|Bhopal|462038|4.8|523|18|400|12000|Engine repair, Denting, AC work|Trusted full-service garage opposite Karond Bus Depot for engine, denting, painting, and AC work.
BPL036|Mechanic|Lalgati Bike|Bhupesh Rawat|+91 98252 76789|lalgati.bike@gmail.com|4, Near Lalgati Petrol Pump|Lalgati|Bhopal|462001|4.7|387|13|150|4000|Two wheeler service, Oil change, Brake repair|Doorstep two-wheeler service near Lalgati Petrol Pump for oil change, brake, and chain repairs.
BPL037|Mechanic|Gandhi Nagar Motors|Pramod Gupta|+91 97553 87890|gn.motors.bpl@gmail.com|1, Gandhi Nagar Tiraha|Gandhinagar|Bhopal|462001|4.6|312|14|400|10000|Gearbox, Clutch, Suspension|Gandhi Nagar Tiraha garage specializing in gearbox rebuilds, clutch, and suspension work.
BPL038|Mechanic|Speed Star Garage|Sunil Tomar|+91 91664 98901|speedstar.karond@gmail.com|Near Karond Overbridge|Karond|Bhopal|462038|4.5|234|10|300|8000|Car AC, Radiator, Cooling system|Car AC servicing, radiator flush, and cooling system repair near Karond Overbridge.
BPL039|Mechanic|Doorstep Mechanic|Abhishek Chauhan|+91 88903 09012|doorstep.mech.bpl@gmail.com|Lalgati Colony|Lalgati|Bhopal|462001|4.8|445|9|250|5000|Doorstep oil change, Battery, Inspection|Mobile mechanic in Lalgati Colony offering doorstep oil change, battery, and inspection.
BPL040|Mechanic|Soni Auto Works|Deepak Soni|+91 96303 10123|soni.auto.gandhinagar@gmail.com|8, Gandhi Nagar Ring Road|Gandhinagar|Bhopal|462001|4.4|178|8|300|7000|Power steering, Brake service, Wheel alignment|Power steering repair, brake service, and wheel alignment on Gandhi Nagar Ring Road.
BPL041|Mechanic|Balaji Two Wheeler|Balaji Rao|+91 94073 21234|balaji.2w.karond@gmail.com|Karond Market|Karond|Bhopal|462038|4.6|267|12|100|3500|Bike service, Scooter repair, Tyre puncture|Two-wheeler specialist near Karond Bank for servicing, scooter repair, and tyre puncture.
BPL042|Mechanic|Turbo Car Care|Rahul Vishwakarma|+91 99263 32345|turbocare.lalgati@gmail.com|Near Lalgati Flyover|Lalgati|Bhopal|462001|4.7|356|15|500|15000|Diesel engine, Turbo, ECU diagnostics|Diesel and turbo engine specialist near Lalgati Flyover with ECU diagnostics.
BPL043|Mechanic|Narmada Auto|Ramkishan Patel|+91 90093 43456|narmada.auto.gandhinagar@gmail.com|5, Gandhi Nagar Naka|Gandhinagar|Bhopal|462001|4.5|201|11|400|9000|Full car service, Denting, Paint work|Annual car servicing, denting, and paint work near Gandhi Nagar Naka.
BPL044|Mechanic|Smart Fix Garage|Irfan Qureshi|+91 77553 54567|smartfix.karond@gmail.com|Behind Karond Stadium|Karond|Bhopal|462038|4.3|132|7|200|5500|Alternator, Battery, Car electrical|Car electrical fault diagnosis, alternator repair, and battery swap behind Karond Stadium.
BPL045|Mechanic|Quick Fix Vehicles|Arjun Pal|+91 93402 65678|quickfix.vehicle.lalgati@gmail.com|Lalgati Main Market|Lalgati|Bhopal|462001|4.4|165|8|200|6000|Oil change, Alignment, AC gas refill|Lalgati Main Market mechanic for oil change, alignment, and AC gas refill.
BPL046|Mechanic|PitStop Auto|Sanket Dubey|+91 91665 76789|pitstop.gandhinagar@gmail.com|Gandhi Nagar Sector A|Gandhinagar|Bhopal|462001|4.6|289|12|350|11000|Suspension, Shock absorber, Brake pads|Suspension, shock absorber replacement, and brake pad servicing in Gandhi Nagar Sector A.
BPL047|Mechanic|Mobile Mechanic|Saurabh Mishra|+91 88904 87890|mobilemech.bpl@gmail.com|Karond-Gandhi Nagar Road|Karond|Bhopal|462038|4.7|398|10|300|6000|Home visit, Doorstep car service, Bike service|Mobile mechanic covering Karond to Gandhi Nagar Road for doorstep car and bike servicing.
BPL048|Mechanic|Highway Motors|Devendra Rajput|+91 96304 98901|highway.motors.lalgati@gmail.com|NH-12, Lalgati Entry|Lalgati|Bhopal|462001|4.5|243|14|400|13000|Heavy vehicle, Truck repair, Trailer work|Heavy vehicle and truck repair at NH-12 Lalgati Entry. Specialists in trailer and bus work.
BPL049|Mechanic|Natraj Auto|Natraj Shukla|+91 94074 09012|natraj.auto.gandhinagar@gmail.com|Behind Gandhi Nagar Fire Station|Gandhinagar|Bhopal|462001|4.4|188|9|300|8000|Car wash, Polish, Annual service|Full car service, wash, and polish behind Gandhi Nagar Fire Station with annual service packages.
BPL050|Mechanic|Ratan Bike Works|Ratan Lal Meena|+91 99264 10123|ratan.bike.karond@gmail.com|Karond Chowk|Karond|Bhopal|462038|4.6|221|11|100|3000|Bike repair, Scooter repair, Quick fixes|Two-wheeler expert near Karond Water Tank for bikes, scooters, and quick fixes.
BPL013|Puncture & Tyre|Shiva Tyre Works|Shiva Prasad|+91 94251 43456|shiva.tyre.karond@gmail.com|Near Karond Flyover|Karond|Bhopal|462038|4.7|389|15|40|600|Tubeless repair, Tyre sales, All vehicles|High-traffic tyre shop near Karond Flyover. Handles all vehicle types with quick turnaround.
BPL014|Puncture & Tyre|Bajrang Puncture|Bajrang Lal|+91 98250 54567|bajrang.puncture.lalgati@gmail.com|Lalgati Chowk|Lalgati|Bhopal|462001|4.5|231|12|30|400|Bike puncture, Roadside tyre help|Fast puncture repair service near Lalgati for bikes, scooters, and cars.
BPL015|Puncture & Tyre|Gandhi Nagar Tyre|Ramu Sahu|+91 97551 65678|gntyre.gandhinagar@gmail.com|6, Gandhi Nagar Naka|Gandhinagar|Bhopal|462001|4.6|276|10|50|700|Nitrogen fill, Rim repair, Wheel balancing|Trusted tyre shop at Gandhi Nagar Naka with nitrogen inflation, rim repair, and wheel balancing.
BPL016|Puncture & Tyre|Hari Om Tyres|Hari Om Pandey|+91 91661 76789|hariom.tyres.karond@gmail.com|Shop 2, Karond Square|Karond|Bhopal|462038|4.4|154|8|40|500|Nitrogen fill, Rim repair, Tyre service|Trusted tyre shop at Karond Square with nitrogen inflation and rim repair services.
BPL017|Puncture & Tyre|Sai Roadside|Sai Baba Rao|+91 88901 87890|sai.roadside.lalgati@gmail.com|NH-12 Side, Lalgati|Lalgati|Bhopal|462001|4.8|412|16|60|900|Emergency puncture, Roadside assistance, 24/7|24-hour emergency puncture and roadside tyre assistance on NH-12 near Lalgati.
BPL018|Puncture & Tyre|Speed Tyre|Dinesh Malviya|+91 96301 98901|speed.tyre.gandhinagar@gmail.com|22, Near Gandhi Nagar Naka|Gandhinagar|Bhopal|462001|4.3|98|6|40|550|Scooter puncture, Valve repair, Walk-in service|Nearby puncture and valve repair shop at Gandhi Nagar Naka for scooters.
BPL019|Puncture & Tyre|Vinayak Tyre|Vinayak Sharma|+91 94071 09012|vinayak.tyre.karond@gmail.com|Opposite Karond Police Station|Karond|Bhopal|462038|4.5|189|11|50|650|Tyre rotation, Tube fixing, Wheel balancing|Opposite Karond Police Station, offering tyre rotation, tube fixing, and wheel balancing.
BPL020|Puncture & Tyre|Mahadev Puncture|Mahadev Tiwari|+91 99261 10123|mahadev.puncture.lalgati@gmail.com|Lalgati Bus Stop|Lalgati|Bhopal|462001|4.4|134|9|30|350|Bike puncture, Scooter puncture, E-rickshaw tyre|Lalgati Bus Stop puncture service for bikes, scooters, and e-rickshaws since 2015.
BPL021|Puncture & Tyre|Reliable Tyre|Govind Kushwaha|+91 90091 21234|reliable.tyre.gandhinagar@gmail.com|8, Gandhi Nagar Ring Road|Gandhinagar|Bhopal|462001|4.6|211|13|50|800|Tyre replacement, Doorstep tyre service, Fitting|Reliable tyre shop on Gandhi Nagar Ring Road with tyre fitting and doorstep service.
BPL022|Puncture & Tyre|Quick Air Tyre|Raju Nishad|+91 77551 32345|quickair.karond@gmail.com|Near Karond Sabzi Mandi|Karond|Bhopal|462038|4.2|76|5|30|300|Puncture fix, Air fill, Walk-in service|Affordable puncture and air fill near Karond Sabzi Mandi. Quick walk-in service.
`.trim();

const parseRows = () => {
  return providerRows.split("\n").map((line) => {
    const [
      sourceId,
      category,
      businessName,
      providerName,
      phone,
      email,
      address,
      area,
      city,
      pincode,
      rating,
      reviewsCount,
      experience,
      hourlyRate,
      priceMax,
      skills,
      description
    ] = line.split("|");

    return {
      sourceId,
      category,
      businessName,
      providerName,
      phone,
      email,
      address,
      area,
      city,
      pincode,
      rating: Number(rating),
      reviewsCount: Number(reviewsCount),
      experience: Number(experience),
      hourlyRate: Number(hourlyRate),
      priceMax: Number(priceMax),
      skills: skills.split(",").map((skill) => skill.trim()).filter(Boolean),
      description
    };
  });
};

const buildWorkingHours = () => {
  return ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((day) => ({
    day,
    startTime: "08:00",
    endTime: "20:00"
  }));
};

const locationFor = (area, sourceId) => {
  const base = areaCoordinates[area] || [77.4126, 23.2599];
  const numericId = Number(String(sourceId).replace(/\D/g, ""));
  const offset = ((numericId % 7) - 3) * 0.001;

  return {
    type: "Point",
    coordinates: [base[0] + offset, base[1] - offset]
  };
};

const ensureCategory = async (name) => {
  const slug = slugify(name);
  const details = categoryDetails[name] || {};

  return Category.findOneAndUpdate(
    { slug },
    {
      name,
      slug,
      icon: details.icon,
      description: details.description,
      isActive: true,
      deletedAt: null
    },
    { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
  );
};

const seedProviders = async () => {
  await connectDB();

  const categories = {};
  for (const name of Object.keys(categoryDetails)) {
    categories[name] = await ensureCategory(name);
  }

  const rows = parseRows();
  let createdOrUpdated = 0;

  for (const row of rows) {
    const phone = normalizePhone(row.phone);
    const category = categories[row.category] || (await ensureCategory(row.category));
    const fullAddress = `${row.businessName}, ${row.address}, ${row.area}, ${row.city}, Madhya Pradesh ${row.pincode}`;

    const user = await User.findOneAndUpdate(
      { phone },
      {
        name: row.providerName,
        phone,
        email: row.email.toLowerCase(),
        role: "provider",
        isVerified: true,
        isActive: true,
        deletedAt: null
      },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    const provider = await ProviderProfile.findOneAndUpdate(
      { userId: user._id },
      {
        userId: user._id,
        category: category.slug,
        categoryId: category._id,
        skills: [row.businessName, ...row.skills].map((skill) => skill.toLowerCase()),
        hourlyRate: row.hourlyRate,
        experience: row.experience,
        rating: row.rating,
        reviewsCount: row.reviewsCount,
        availabilityStatus: "available",
        address: fullAddress,
        location: locationFor(row.area, row.sourceId),
        verificationStatus: "approved",
        verifiedAt: new Date(),
        isPremium: row.rating >= 4.7
      },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    await Availability.findOneAndUpdate(
      { providerId: provider._id },
      {
        providerId: provider._id,
        isOnline: true,
        isAvailable: true,
        workingHours: buildWorkingHours(),
        lastActive: new Date()
      },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    await Portfolio.findOneAndUpdate(
      { providerId: provider._id, title: row.businessName },
      {
        providerId: provider._id,
        title: row.businessName,
        description: `${row.description} Price range: Rs.${row.hourlyRate} - Rs.${row.priceMax}. Source: ${row.sourceId}.`,
        images: []
      },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true }
    );

    createdOrUpdated += 1;
  }

  await Category.bulkWrite(
    Object.values(categories).map((category) => ({
      updateOne: {
        filter: { _id: category._id },
        update: {
          $set: {
            usageCount: rows.filter((row) => slugify(row.category) === category.slug).length
          }
        }
      }
    }))
  );

  console.log(`Seeded ${createdOrUpdated} PDF providers into ${process.env.MONGO_URI}.`);
};

seedProviders()
  .catch((error) => {
    console.error("Failed to seed PDF providers:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
