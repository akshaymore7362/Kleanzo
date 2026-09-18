import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Kleanzo database with realistic demo data...');

  // 1. Seed Matching Weight Config
  await prisma.matchingWeightConfig.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      serviceCapability: 25.0,
      availability: 20.0,
      distance: 20.0,
      qualityRating: 15.0,
      experience: 10.0,
      price: 5.0,
      responseSpeed: 5.0,
    },
  });

  // 2. Seed Services
  const services = [
    {
      slug: 'interior-handover-cleaning',
      name: 'Interior Handover Cleaning',
      category: 'HANDOVER',
      description: 'Comprehensive post-completion detail cleaning for interior designers & architects preparing properties for client handover.',
      startingPrice: 8500,
      estimatedDuration: '6-8 Hours',
      suitableFor: 'Architects, Interior Designers, Handover Ready Sites',
      includedFeatures: JSON.stringify([
        'Full site construction dust removal',
        'Floor degreasing & residue wiping',
        'Cabinet interior & exterior vacuuming',
        'Sanitaryware polishing & mirror sparkle',
        'Glass, window track & frame detailing',
        'Final inspection tag & photo signoff',
      ]),
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    },
    {
      slug: 'post-construction-cleaning',
      name: 'Post Construction Cleaning',
      category: 'HANDOVER',
      description: 'Heavy duty debris clearance, fine wood/cement dust extraction, and surface restoration after civil & carpentry work.',
      startingPrice: 12000,
      estimatedDuration: '1-2 Days',
      suitableFor: 'Builders, Commercial Contractors, Renovation Sites',
      includedFeatures: JSON.stringify([
        'HEPA filter industrial dust extraction',
        'Cement splash removal from tiles',
        'Laminate & veneer edge tape residue removal',
        'Light fixture & AC vent cleaning',
        'Debris bagging & disposal support',
      ]),
      image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
    },
    {
      slug: 'glue-fevicol-removal',
      name: 'Glue & Fevicol Removal',
      category: 'STAIN_REMOVAL',
      description: 'Specialized chemical solvent treatment to dissolve tough synthetic adhesives, carpentry glue, and laminate bond residue without surface scratching.',
      startingPrice: 3500,
      estimatedDuration: '3-4 Hours',
      suitableFor: 'Woodwork sites, Laminate floors, Marble borders',
      includedFeatures: JSON.stringify([
        'Surface safety compatibility check',
        'Non-abrasive solvent softening',
        'Precision hand scraping with plastic edges',
        'Neutralizing wash & surface polish',
      ]),
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    },
    {
      slug: 'paint-colour-removal',
      name: 'Paint & Colour Stain Cleaning',
      category: 'STAIN_REMOVAL',
      description: 'Safe removal of emulsion splashes, enamel drips, and wood stain overspray from glass, tiles, marble, and fixtures.',
      startingPrice: 4000,
      estimatedDuration: '3-5 Hours',
      suitableFor: 'Post-painting touchup, Glass facades, Marble floors',
      includedFeatures: JSON.stringify([
        'Multi-surface paint solvent application',
        'Razor micro-cleaning for window glass',
        'Tile grout paint spot extraction',
        'Non-acidic stone rinse',
      ]),
      image: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80',
    },
    {
      slug: 'cement-grout-cleaning',
      name: 'Cement & Grout Cleaning',
      category: 'STAIN_REMOVAL',
      description: 'Heavy duty descaling of tile grout haze, dried cement slurry, and white efflorescence stains on stone surfaces.',
      startingPrice: 4500,
      estimatedDuration: '4-6 Hours',
      suitableFor: 'New tile installations, Bathrooms, Balconies',
      includedFeatures: JSON.stringify([
        'pH-balanced grout film removers',
        'Rotary floor scrubbing',
        'Corner & tile joint power detailing',
        'Protective grout sealer application option',
      ]),
      image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80',
    },
    {
      slug: 'floor-stone-polishing',
      name: 'Floor & Stone Deep Scrubbing',
      category: 'SURFACE',
      description: 'Single-disc machine scrubbing, diamond pad hone buffing, and stone sealer application for Italian marble, granites & tiles.',
      startingPrice: 9500,
      estimatedDuration: '6-8 Hours',
      suitableFor: 'Italian Marble, Vitrified Tiles, Terrazzo, Granite',
      includedFeatures: JSON.stringify([
        'Single-disc rotary scrubbing machine treatment',
        'Slurry extraction vacuuming',
        'pH neutral gloss enhancing rinse',
        'Anti-skid buffing finish',
      ]),
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    },
  ];

  for (const s of services) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    });
  }

  // 3. Seed Stain Types
  const stainTypes = [
    {
      slug: 'glue-fevicol',
      name: 'Glue / Fevicol Residue',
      category: 'Adhesive',
      description: 'Hardened synthetic resin glue, carpentry adhesive, or laminate contact cement.',
      surfaceCompatibility: JSON.stringify(['Marble', 'Tile', 'Wood', 'Glass', 'Laminate']),
      difficultyLevel: 'High',
      safetyNotice: 'Requires custom solvent treatment. Do not use metal razors on polished wood or laminate.',
      sampleImage: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    },
    {
      slug: 'paint-emulsion',
      name: 'Paint & Emulsion Overspray',
      category: 'Paint',
      description: 'Dried acrylic paint, enamel drips, or ceiling emulsion splatters.',
      surfaceCompatibility: JSON.stringify(['Glass', 'Tile', 'Marble', 'Metal', 'Sanitaryware']),
      difficultyLevel: 'Moderate',
      safetyNotice: 'Final removal success depends on paint age and porosity of the substrate.',
      sampleImage: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?auto=format&fit=crop&w=800&q=80',
    },
    {
      slug: 'cement-slurry',
      name: 'Cement & Tile Grout Haze',
      category: 'Construction',
      description: 'White grout residue, thin-set mortar splashes, or dry cement film.',
      surfaceCompatibility: JSON.stringify(['Vitrified Tile', 'Granite', 'Ceramic', 'Concrete']),
      difficultyLevel: 'High',
      safetyNotice: 'Acidic cleaners must never be used on acid-sensitive natural marble or limestone.',
      sampleImage: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80',
    },
    {
      slug: 'silicone-sealant',
      name: 'Silicone & Caulk Residue',
      category: 'Sealant',
      description: 'Excess silicone sealant around glass panes, sink counters, and shower enclosures.',
      surfaceCompatibility: JSON.stringify(['Glass', 'Granite', 'Ceramic', 'Aluminum']),
      difficultyLevel: 'Moderate',
      safetyNotice: 'Requires silicone digester gel and mechanical stripping with non-marring blades.',
      sampleImage: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
    },
  ];

  for (const st of stainTypes) {
    await prisma.stainType.upsert({
      where: { slug: st.slug },
      update: st,
      create: st,
    });
  }

  // 4. Seed Demo Users & Agencies
  const architectUser = await prisma.user.upsert({
    where: { email: 'architect@studioaura.com' },
    update: {},
    create: {
      email: 'architect@studioaura.com',
      password: 'password123',
      name: 'Ar. Rajesh Sharma',
      phone: '+91 98230 11223',
      role: 'ARCHITECT',
      customerProfile: {
        create: {
          companyName: 'Aura Architecture & Design Studio',
          businessType: 'Architectural Firm',
          city: 'Pune',
          state: 'Maharashtra',
          pinCode: '411045',
          address: 'Baner High Street, Baner, Pune',
        },
      },
    },
    include: { customerProfile: true },
  });

  const designerUser = await prisma.user.upsert({
    where: { email: 'designer@priyainteriors.com' },
    update: {},
    create: {
      email: 'designer@priyainteriors.com',
      password: 'password123',
      name: 'Priya Kulkarni',
      phone: '+91 98900 44556',
      role: 'INTERIOR_DESIGNER',
      customerProfile: {
        create: {
          companyName: 'Priya Kulkarni Design Co.',
          businessType: 'Interior Design Studio',
          city: 'Pune',
          state: 'Maharashtra',
          pinCode: '411007',
          address: 'Aundh, Pune',
        },
      },
    },
    include: { customerProfile: true },
  });

  // Agency 1: ShinePro Cleaning Services
  const agencyUser1 = await prisma.user.upsert({
    where: { email: 'contact@shineproclean.com' },
    update: {},
    create: {
      email: 'contact@shineproclean.com',
      password: 'password123',
      name: 'ShinePro Operations',
      phone: '+91 98221 99887',
      role: 'CLEANING_AGENCY',
      agency: {
        create: {
          name: 'ShinePro Cleaning Services',
          tagline: 'Precision Post-Construction & Handover Specialists',
          description: 'Verified top-tier commercial and high-end residential cleaning agency operating since 2018 with 40+ trained technicians.',
          logoUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=200&h=200&q=80',
          verified: true,
          rating: 4.9,
          reviewCount: 58,
          experienceYears: 7,
          minOrderPrice: 3500,
          baseHourlyRate: 650,
          phone: '+91 98221 99887',
          email: 'contact@shineproclean.com',
          address: 'Plot 42, Baner Road',
          city: 'Pune',
          state: 'Maharashtra',
          pinCode: '411045',
          lat: 18.559,
          lng: 73.7868,
          serviceRadiusKm: 30,
          serviceAreas: {
            create: [
              { city: 'Pune', areaName: 'Baner', pinCode: '411045' },
              { city: 'Pune', areaName: 'Aundh', pinCode: '411007' },
              { city: 'Pune', areaName: 'Wakad', pinCode: '411057' },
              { city: 'Pune', areaName: 'Hinjewadi', pinCode: '411057' },
            ],
          },
        },
      },
    },
    include: { agency: true },
  });

  // Agency 2: CleanMax Infrastructure Solutions
  const agencyUser2 = await prisma.user.upsert({
    where: { email: 'info@cleanmaxsolutions.com' },
    update: {},
    create: {
      email: 'info@cleanmaxsolutions.com',
      password: 'password123',
      name: 'CleanMax Manager',
      phone: '+91 97654 33211',
      role: 'CLEANING_AGENCY',
      agency: {
        create: {
          name: 'CleanMax Infrastructure Solutions',
          tagline: 'Heavy Post-Civil & Stain Remediation Experts',
          description: 'Specialists in heavy cement haze removal, Italian marble single-disc polishing, and glue/paint solvent treatments.',
          logoUrl: 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?auto=format&fit=crop&w=200&h=200&q=80',
          verified: true,
          rating: 4.7,
          reviewCount: 42,
          experienceYears: 6,
          minOrderPrice: 4000,
          baseHourlyRate: 550,
          phone: '+91 97654 33211',
          email: 'info@cleanmaxsolutions.com',
          address: 'Commerce Center, Viman Nagar',
          city: 'Pune',
          state: 'Maharashtra',
          pinCode: '411014',
          lat: 18.5679,
          lng: 73.9143,
          serviceRadiusKm: 25,
          serviceAreas: {
            create: [
              { city: 'Pune', areaName: 'Viman Nagar', pinCode: '411014' },
              { city: 'Pune', areaName: 'Kharadi', pinCode: '411014' },
              { city: 'Pune', areaName: 'Kalyani Nagar', pinCode: '411006' },
              { city: 'Pune', areaName: 'Hadapsar', pinCode: '411028' },
            ],
          },
        },
      },
    },
    include: { agency: true },
  });

  // 5. Seed Demo Project
  if (architectUser.customerProfile && agencyUser1.agency) {
    const handoverService = await prisma.service.findUnique({ where: { slug: 'interior-handover-cleaning' } });
    
    const demoProject = await prisma.project.upsert({
      where: { projectCode: 'KLZ-2026-8812' },
      update: {},
      create: {
        projectCode: 'KLZ-2026-8812',
        customerId: architectUser.customerProfile.id,
        title: 'Aura Residence - Luxury Penthouse Handover',
        clientName: 'Dr. Vivek Singhania',
        stage: 'Interior Handover',
        locationAddress: 'Flat 1401, Tower B, Pancard Club Road, Baner',
        city: 'Pune',
        pinCode: '411045',
        notes: 'Client handover scheduled for 20th September. High polish marble floors and veneer wardrobes require dust-free finish.',
      },
    });

    const demoBooking = await prisma.booking.upsert({
      where: { bookingCode: 'KLZ-BK-9021' },
      update: {},
      create: {
        bookingCode: 'KLZ-BK-9021',
        projectId: demoProject.id,
        customerId: architectUser.id,
        agencyId: agencyUser1.agency.id,
        serviceId: handoverService?.id,
        surfaceType: 'Italian Marble & Polish Veneer',
        status: 'IN_PROGRESS',
        scheduledDate: '2026-09-15',
        scheduledTime: '10:00 AM',
        propertyType: '4 BHK Luxury Penthouse',
        propertyAreaSqft: 3400,
        totalAmount: 14500,
        paymentStatus: 'PAID',
        beforeAfterMedia: {
          create: [
            {
              stage: 'BEFORE',
              imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=800&q=80',
              caption: 'Construction dust on marble floor and veneer cabinets prior to treatment.',
            },
            {
              stage: 'AFTER',
              imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
              caption: 'Handover ready mirror polish floor finish after Kleanzo deep detail.',
            },
          ],
        },
      },
    });

    console.log(`Seeded Demo Project ${demoProject.projectCode} and Booking ${demoBooking.bookingCode}`);
  }

  console.log('Database seeding complete successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
