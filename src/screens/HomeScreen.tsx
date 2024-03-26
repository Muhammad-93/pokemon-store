import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
  Modal,
} from 'react-native';
import constants from '../constants/Constants';
import Header from '../components/common/Header.tsx';
import BottomTab from '../routes/BottomTab';
import PokemonCard from '../components/home/PokemonCard.tsx';
import axios from 'axios';

const HomeScreen = () => {
  const [offset, setOffset] = useState<number>(0);
  const [pokemonData, setPokemonData] = useState<any>([]);
  const [showModal, setShowModal] = useState<boolean>(false); // State to control modal visibility

  useEffect(() => {
    fetchData(); // Initial data fetch
  }, [offset]);

  const fetchData = async () => {
    setShowModal(true);
    // Show modal when making API call
    axios
      .get('https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}')
      .then((response: any) => {
        setPokemonData((prevData: any) => [
          ...prevData,
          ...response.data.results,
        ]); // Concatenate new data with previous data
      })
      .catch((error: any) => {
        console.error('Error while fetching pokemon list api:', error);
      })
      .finally(() => {
        setShowModal(false); // Hide modal when response is received
      });
  };

  const handleEndReached = () => {
    setOffset(prevOffset => prevOffset + 5); // Increment offset by 5 when end of list is reached
  };

  //this Component will render in Flatlist
  const renderItem = ({item, index}: {item: any; index: number}) => (
    <PokemonCard data={item} id={index + 1} />
  );

  return (
    <View style={styles.mainContainer}>
      <Header />
      <View style={styles.innerContainer}>
        <Text style={styles.heading}>Find the best Pokemon for you</Text>
        <FlatList
          data={pokemonData}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listsContainer}
          onEndReached={handleEndReached} // Call handleEndReached function when end of list is reached
          onEndReachedThreshold={0.5} // Load more data when the end is within half the visible length
        />
        <Modal transparent={true} visible={showModal}>
          <View style={styles.modalContainer}>
            <ActivityIndicator
              size="large"
              color={constants.colors.lightPeach}
              style={styles.activityIndicator}
            />
          </View>
        </Modal>
      </View>
      <View style={styles.bottomTab}>
        <BottomTab />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: constants.colors.background,
  },
  innerContainer: {
    backgroundColor: constants.colors.background,
    paddingBottom: 120,
  },
  heading: {
    color: constants.colors.white,
    marginVertical: '4%',
    fontSize: 28,
    fontWeight: '700',
    width: '60%',
    marginLeft: '5%',
    fontFamily: 'Poppins-Regular',
  },
  bottomTab: {
    position: 'absolute',
    bottom: 0,
  },
  listsContainer: {
    paddingHorizontal: '5%',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Transparent background
  },
  activityIndicator: {
    alignSelf: 'center',
  },
});

export default HomeScreen;
