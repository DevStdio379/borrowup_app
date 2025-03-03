import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import StarRating from 'react-native-star-rating-widget';

interface ReviewCardProps {
  reviewerName: string;
  rating: number;
  reviewText: string;
  avatarUrl?: string; // Optional: You can display an avatar if available
  date?: string; // Optional: Timestamp of the review
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  reviewerName,
  rating,
  reviewText,
  avatarUrl,
  date,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        {avatarUrl ? (
          <Image source={{ uri: avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder} />
        )}
        <View style={styles.reviewerInfo}>
          <Text style={styles.reviewerName}>{reviewerName}</Text>
          {date && <Text style={styles.date}>{date}</Text>}
        </View>
      </View>
      
      <StarRating rating={rating} maxStars={5} starSize={20} onChange={ () => {}} />
      
      <Text style={styles.reviewText}>{reviewText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    marginHorizontal: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    width: 300, 
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#ccc',
    marginRight: 10,
  },
  reviewerInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 12,
    color: '#888',
  },
  reviewText: {
    marginTop: 10,
    fontSize: 14,
    color: '#333',
  },
});

export default ReviewCard;
