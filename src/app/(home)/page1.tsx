// "use client";
// import dynamic from "next/dynamic";
// import { useState, useEffect } from "react";

// import Header2 from "@/components/Header2/Header2";
// import PartnerSection from "@/components/PartnerSection";
// import Footer2 from "@/components/footer2/Footer2";

// // Dynamically import components that use browser APIs
// const Scrollbar = dynamic(() => import("@/components/scrollbar/scrollbar"), {
//   ssr: false,
// });

// const Hero4 = dynamic(() => import("@/components/hero4/hero4"));
// const About4 = dynamic(() => import("@/components/about4/about4"));
// const Testimonial = dynamic(
//   () => import("@/components/Testimonial/Testimonial")
// );
// const StoriesSection3 = dynamic(
//   () => import("@/components/StoriesSection3/StoriesSection3")
// );
// const BlogSection4 = dynamic(
//   () => import("@/components/BlogSection4/BlogSection4")
// );

// export default function Home() {
//   const [isClient, setIsClient] = useState(false);

//   useEffect(() => {
//     setIsClient(true);
//   }, []);

//   if (!isClient) {
//     return null;
//   }
//   return (
//     <div>
//       <Header2 />
//       <main className="main main--wrapper4">
//         <Hero4 />
//         <About4 />
//         <Testimonial />
//         <StoriesSection3 />
//         <BlogSection4 />
//         <PartnerSection pClass={"sponsors--style2"} />
//       </main>
//       <Footer2 />
//       <Scrollbar />
//     </div>
//   );
// }
