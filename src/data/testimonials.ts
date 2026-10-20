/** Client-approved testimonials. Text is used exactly as supplied. */
export interface Testimonial {
  id: "tyson-johnson" | "chris-gormley" | "michael-royer" | "lu-miller";
  name: string;
  role: string;
  quote: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "tyson-johnson",
    name: "Tyson Johnson",
    role: "Founder, Levitate Clothing",
    quote: "Running a startup clothing line is one of the most difficult businesses to build. In attempt to reserve funds, I tasked myself with design, purchasing, inventory management, shipping, social media marketing, and accounting. After a few months I realized I was sinking my own company and needed help. I hired Josh to manage all my accounting and financial forecasting so I could focus on the day to day. The support I received was critical to my growth, his services allowed me to effectively manage my cashflow and utilize opportunities to grow my business. I highly recommend Josh to any small business looking for a reliable and ethical F&A partner.",
  },
  {
    id: "chris-gormley",
    name: "Chris Gormley",
    role: "CEO, Network Ventures Group",
    quote: "Josh and I have been friends for nearly a decade, and he's always been fun, hardworking, and creative. When I founded Network Ventures, Inc., my Real Estate Investment company, in 2020, his extensive background in real estate accounting made him the perfect partner. He reached out to help set up systems for my residential flips, and as I transitioned into commercial projects, his support became even more valuable. He's been essential in organizing invoicing, draw schedules, accounts payable, and ensuring all financial documents are in order. Beyond his expertise, our honest and caring partnership fosters trust and growth. I highly recommend Josh for any financial endeavors; his intelligence and personality truly stand out.",
  },
  {
    id: "michael-royer",
    name: "Michael Royer",
    role: "Founder & Principal Attorney, Royer Law Group, APC",
    quote: "After starting my own firm and managing every aspect for the first year I realized keeping up with the accounting was causing other aspects of running my firm to suffer. There are many nuances managing financials in the legal industry, and I was hesitant to hand the responsibility off to just any firm. Josh showed his in-depth knowledge of the legal field as well as providing great client service that left me with no questions I went with the right firm for my accounting and financial needs.",
  },
  {
    id: "lu-miller",
    name: "Lu Miller",
    role: "Co-Founder, DTS, Inc.",
    quote: "I couldn't be more pleased with the work and support I receive from Josh. As a medical professional with no financial background, Josh set up my QuickBooks accounts in a way that I could understand and utilize to gather the information I need to keep my physical therapy business on track fiscally. I found Josh to be efficient, organized, patient, and professional in all my interactions. I continue to rely on him to keep my business on track so I can focus on the clinical aspects of my business.",
  },
];

export function getTestimonial(id: Testimonial["id"]): Testimonial {
  const t = testimonials.find((x) => x.id === id);
  if (!t) throw new Error(`Unknown testimonial: ${id}`);
  return t;
}
