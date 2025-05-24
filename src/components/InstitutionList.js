import React from 'react';
import { View } from 'react-native';
import InstitutionCard from './InstitutionCard';

export default function InstitutionList({ institutions, city }) {
  return (
    <View>
      {institutions.map((item, idx) => (
        <InstitutionCard
          key={item.name + idx}
          name={item.name}
          distance={item.distance}
          type={item.type}
          city={city}
        />
      ))}
    </View>
  );
}