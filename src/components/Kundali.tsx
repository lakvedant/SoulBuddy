// import React, { useState, useEffect } from 'react';

// const VedicAstroChart = ({ userId }) => {
//   const [userData, setUserData] = useState(null);
//   const [chartImageSvg, setChartImageSvg] = useState('');

//   useEffect(() => {
//     const fetchUserData = async () => {
//       try {
//         const response = await fetch(`/api/users?userId=${userId}`);
//         const data = await response.json();
//         setUserData(data);
//       } catch (error) {
//         console.error('Error fetching user data:', error);
//       }
//     };

//     fetchUserData();
//   }, [userId]);

//   useEffect(() => {
//     const fetchChartImage = async () => {
//       if (userData) {
//         const { date_of_birth, latitude, longitude, timezone } = userData;
//         const [dob, tob] = date_of_birth.split('T')[0].split('-');

//         const params = {
//           lang: 'en',
//           api_key: process.env.NEXT_PUBLIC_VEDIC_ASTRO_API_KEY,
//           lat: latitude,
//           lon: longitude, 
//           tz: timezone,
//           div: 'D3',
//           style: 'north',
//           color: '#9d00ff',
//           dob: `${dob[1]}/${dob[2]}/${dob[0]}`,
//           tob: tob.slice(0, 5),
//         };

//         const queryString = new URLSearchParams(params).toString();
//         const url = `https://api.vedicastroapi.com/v3-json/horoscope/chart-image?${queryString}`;

//         try {
//           const response = await fetch(url);
//           const data = await response.text();
//           setChartImageSvg(data);
//         } catch (error) {
//           console.error('Error fetching chart image:', error);
//         }
//       }
//     };

//     fetchChartImage();
//   }, [userData]);

//   return (
//     <div className="w-full h-96 flex justify-center items-center">
//       {chartImageSvg ? (
//         <div dangerouslySetInnerHTML={{ __html: chartImageSvg }} />
//       ) : (
//         <p>Loading chart...</p>
//       )}
//     </div>
//   );
// };

// export default VedicAstroChart;