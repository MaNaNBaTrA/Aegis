// import { useRouter } from 'expo-router';
// import React, { useEffect, useState } from 'react';
// import { View, Text, Image } from 'react-native';

// const HeroDetail = () => {
//   const router = useRouter();
//   const { heroId } = router.query; // Access heroId from query params
//   const [hero, setHero] = useState(null);

//   useEffect(() => {
//     // Fetch hero data based on heroId
//     if (heroId) {
//       // Fetch hero details from your data source
//       setHero({ id: heroId, name: 'Hero Name', uri: 'https://someurl.com' }); // Example, replace with real data fetching logic
//     }
//   }, [heroId]);

//   if (!hero) return null; // Loading state

//   return (
//     <View>
//       <Image source={{ uri: hero.uri }} style={{ width: 100, height: 100 }} />
//       <Text>{hero.name}</Text>
//     </View>
//   );
// };

// export default HeroDetail;
