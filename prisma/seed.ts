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
  const servicesData = [
    {
      slug: 'deep-cleaning',
      name: 'Deep Cleaning Service',
      category: 'HANDOVER',
      description: 'Comprehensive 6-stage deep detail cleaning for residential apartments & villas.',
      startingPrice: 4499,
      estimatedDuration: '4-6 Hours',
      suitableFor: 'Homeowners, Tenants, Handover Sites',
      includedFeatures: JSON.stringify([
        'Full property dust extraction',
        'Floor degreasing & scrubbing',
        'Kitchen degreasing & tile descaling',
        'Bathroom sanitization & mirror polish',
        'Window track detailing',
      ]),
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    },
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
  ];

  const dbServices = [];
  for (const s of servicesData) {
    const created = await prisma.service.upsert({
      where: { slug: s.slug },
      update: s,
      create: s,
    });
    dbServices.push(created);
  }

  // 3. Seed Demo Users & Agencies
  const customerUser = await prisma.user.upsert({
    where: { email: 'rahul.j@example.com' },
    update: {},
    create: {
      email: 'rahul.j@example.com',
      password: 'password123',
      name: 'Rahul Jaykar',
      phone: '+91 98765 43210',
      role: 'CUSTOMER',
      customerProfile: {
        create: {
          city: 'Pune',
          state: 'Maharashtra',
          pinCode: '411045',
          address: 'Flat 402, Rosewood Society, Baner, Pune',
        },
      },
    },
  });

  // Agency 1: ShinePro Cleaning Services (Active, Nearest ~ 3.2 KM away)
  const agencyUser1 = await prisma.user.upsert({
    where: { email: 'contact@shineproclean.com' },
    update: {},
    create: {
      email: 'contact@shineproclean.com',
      password: 'password123',
      name: 'ShinePro Operations',
      phone: '+91 98221 99887',
      role: 'AGENCY_ADMIN',
      agency: {
        create: {
          name: 'ShinePro Cleaning Services',
          ownerName: 'Suresh Kumar',
          partnerStatus: 'ACTIVE',
          partnerTier: 'PREFERRED',
          verified: true,
          active: true,
          rating: 4.9,
          reviewCount: 58,
          experienceYears: 7,
          minOrderPrice: 2500,
          phone: '+91 98221 99887',
          email: 'contact@shineproclean.com',
          address: 'Plot 42, Baner Road, Baner',
          city: 'Pune',
          state: 'Maharashtra',
          pinCode: '411045',
          lat: 18.559,
          lng: 73.7868,
          serviceRadiusKm: 25,
          serviceAreas: {
            create: [
              { city: 'Pune', areaName: 'Baner', pinCode: '411045' },
              { city: 'Pune', areaName: 'Wakad', pinCode: '411057' },
              { city: 'Pune', areaName: 'Aundh', pinCode: '411007' },
            ],
          },
          crewMembers: {
            create: [
              { name: 'Suresh Kumar', phone: '+91 98221 99887', role: 'LEAD', active: true },
              { name: 'Mahesh Patil', phone: '+91 98221 99888', role: 'CLEANER', active: true },
              { name: 'Rahul Shinde', phone: '+91 98221 99889', role: 'CLEANER', active: true },
              { name: 'Akash More', phone: '+91 98221 99890', role: 'CLEANER', active: true },
            ],
          },
        },
      },
    },
    include: { agency: true },
  });

  // Link services to ShinePro
  if (agencyUser1.agency) {
    for (const s of dbServices) {
      await prisma.agencyService.upsert({
        where: { id: `shinepro-${s.id}` },
        update: { active: true },
        create: {
          id: `shinepro-${s.id}`,
          agencyId: agencyUser1.agency.id,
          serviceId: s.id,
          active: true,
        },
      });
    }
  }

  // Agency 2: CleanMax Infrastructure (Active, ~ 5.8 KM away)
  const agencyUser2 = await prisma.user.upsert({
    where: { email: 'info@cleanmaxsolutions.com' },
    update: {},
    create: {
      email: 'info@cleanmaxsolutions.com',
      password: 'password123',
      name: 'CleanMax Manager',
      phone: '+91 97654 33211',
      role: 'AGENCY_ADMIN',
      agency: {
        create: {
          name: 'CleanMax Solutions',
          ownerName: 'Vijay Deshmukh',
          partnerStatus: 'ACTIVE',
          partnerTier: 'ACTIVE',
          verified: true,
          active: true,
          rating: 4.7,
          reviewCount: 42,
          experienceYears: 5,
          minOrderPrice: 2500,
          phone: '+91 97654 33211',
          email: 'info@cleanmaxsolutions.com',
          address: 'Commerce Center, Aundh',
          city: 'Pune',
          state: 'Maharashtra',
          pinCode: '411007',
          lat: 18.562,
          lng: 73.805,
          serviceRadiusKm: 25,
          serviceAreas: {
            create: [
              { city: 'Pune', areaName: 'Aundh', pinCode: '411007' },
              { city: 'Pune', areaName: 'Baner', pinCode: '411045' },
            ],
          },
          crewMembers: {
            create: [
              { name: 'Vijay Deshmukh', phone: '+91 97654 33211', role: 'LEAD', active: true },
              { name: 'Karan Joshi', phone: '+91 97654 33212', role: 'CLEANER', active: true },
            ],
          },
        },
      },
    },
    include: { agency: true },
  });

  if (agencyUser2.agency) {
    for (const s of dbServices) {
      await prisma.agencyService.upsert({
        where: { id: `cleanmax-${s.id}` },
        update: { active: true },
        create: {
          id: `cleanmax-${s.id}`,
          agencyId: agencyUser2.agency.id,
          serviceId: s.id,
          active: true,
        },
      });
    }
  }

  console.log('Database seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
