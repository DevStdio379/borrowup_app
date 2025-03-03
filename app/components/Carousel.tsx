import React, { useState, useRef, useEffect } from 'react';
import { View, ScrollView, Dimensions, StyleSheet, Image, NativeSyntheticEvent, NativeScrollEvent, Pressable, Text } from 'react-native';

const { width, height } = Dimensions.get('window');

interface CarouselProps {
    data: { imageUrl: string; buttonText: string; }[];
    autoScrollInterval?: number; // Optional prop to customize auto-scroll interval
}

const Carousel: React.FC<CarouselProps> = ({ data, autoScrollInterval = 3000 }) => {
    const scrollViewRef = useRef<ScrollView>(null);
    const [currentIndex, setCurrentIndex] = useState<number>(0);

    useEffect(() => {
        const interval = setInterval(() => {
            scrollToNext();
        }, autoScrollInterval);

        return () => clearInterval(interval); // Clear the interval when the component unmounts
    }, [currentIndex]);

    const scrollToNext = () => {
        const nextIndex = (currentIndex + 1) % data.length;
        setCurrentIndex(nextIndex);
        if (scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ x: nextIndex * width, animated: true });
        }
    };

    const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const index = Math.round(contentOffsetX / width);
        setCurrentIndex(index);
    };

    const renderIndicators = () => {
        return (
            <View style={styles.indicatorContainer}>
                {data.map((_, index) => (
                    <View
                        key={index}
                        style={[
                            styles.indicator,
                            currentIndex === index ? styles.activeIndicator : null,
                        ]}
                    />
                ))}
            </View>
        );
    };

    return (
        <View>
            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={onScroll}
                scrollEventThrottle={16}
            >
                {data.map((item, index) => (
                    <View key={index} style={styles.imageContainer}>
                        <Image
                            style={styles.image}
                            source={{ uri: item.imageUrl }}
                        />
                        <Pressable style={styles.button}>
                            <Text style={styles.buttonText}>{item.buttonText}</Text>
                        </Pressable>
                    </View>
                ))}
            </ScrollView>
            {renderIndicators()}
        </View>
    );
};

const styles = StyleSheet.create({
    imageContainer: {
        width: width,
        height: height / 3.5,
        position: 'relative',
        overflow: 'hidden', // Ensure child elements respect the border radius
        borderRadius: 15, // Adjust this value for the desired border radius
        padding: 10,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
        borderRadius: 25, // Apply border radius to the image itself
    },
    button: {
        position: 'absolute',
        bottom: 20,
        left: width / 2.7,
        backgroundColor: 'rgba(0,0,0,0.5)',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
    indicatorContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    indicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#ccc',
        marginHorizontal: 4,
    },
    activeIndicator: {
        backgroundColor: '#000',
    },
});

export default Carousel;
