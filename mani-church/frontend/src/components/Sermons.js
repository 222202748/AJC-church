
// import React from 'react';
// import { useLanguage } from '../contexts/LanguageContext';
// import { translations } from '../translations';

// const SermonCard = ({ title, category, time, pastor, image }) => {
//   const { language } = useLanguage();
//   const t = translations[language];

//   return (
//     <div className="col-sm-12 col-md-6 col-lg-4 d-flex">
//       <div className="card bg-dark text-white w-100">
//         <img src={image} className="card-img img-fluid" alt={title} style={{ objectFit: 'cover', height: '200px' }} />
//         <div className="card-img-overlay d-flex justify-content-center align-items-center">
//           <button className="btn btn-light rounded-circle p-2">
//             <i className="bi bi-play-fill fs-3"></i>
//           </button>
//         </div>
//         <div className="card-body bg-white text-dark">
//           <small className={`badge ${category.color} mb-2`}>{category.name}</small>
//           <h5 className="card-title">{title}</h5>
//           <p className="mb-1"><i className="bi bi-calendar"></i> {time}</p>
//           <p><i className="bi bi-person"></i> {t.sermons.pastorLabel}: {pastor}</p>
//           <div className="d-flex gap-3">
//             <i className="bi bi-share"></i>
//             <i className="bi bi-download"></i>
//             <i className="bi bi-bookmark"></i>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// const Sermons = () => {
//   const { language } = useLanguage();
//   const t = translations[language];

//   const sermons = [
//     {
//       title: t.sermons.sermon1.title,
//       category: { name: t.sermons.categories.theosis, color: 'bg-success' },
//       time: t.sermons.timeSlot,
//       pastor: t.sermons.pastors.darrell,
//       image: 'https://via.placeholder.com/600x400?text=Sermon+1'
//     },
//     {
//       title: t.sermons.sermon2.title,
//       category: { name: t.sermons.categories.pneuma, color: 'bg-primary' },
//       time: t.sermons.timeSlot,
//       pastor: t.sermons.pastors.rick,
//       image: 'https://via.placeholder.com/600x400?text=Sermon+2'
//     },
//     {
//       title: t.sermons.sermon3.title,
//       category: { name: t.sermons.categories.agape, color: 'bg-info text-dark' },
//       time: t.sermons.timeSlot,
//       pastor: t.sermons.pastors.darrell,
//       image: 'https://via.placeholder.com/600x400?text=Sermon+3'
//     }
//   ];

//   return (
//     <section className="text-white py-5" style={{ background: 'linear-gradient(to right, #5d3a1a, #2d1b07)' }}>
//       <div className="container">
//         <div className="text-center mb-4">
//           <h2>{t.sermons.todaySermon}</h2>
//           <p>{t.sermons.description}</p>
//         </div>
//         <div className="row g-4">
//           {sermons.map((sermon, index) => (
//             <SermonCard key={index} {...sermon} />
//           ))}
//         </div>
//         <div className="text-center mt-4">
//           <a 
//             href="/sermon-registration"
//             className="btn btn-primary btn-lg px-4 py-2 rounded-pill fw-bold text-uppercase"
//             style={{
//               background: 'linear-gradient(45deg, #5d3a1a, #2d1b07)',
//               border: 'none',
//               boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
//               transition: 'transform 0.3s ease, box-shadow 0.3s ease'
//             }}
//             onMouseOver={(e) => {
//               e.currentTarget.style.transform = 'translateY(-2px)';
//               e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
//             }}
//             onMouseOut={(e) => {
//               e.currentTarget.style.transform = 'translateY(0)';
//               e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
//             }}
//           >
//             {t.sermons.registerButton}
//           </a>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Sermons;
