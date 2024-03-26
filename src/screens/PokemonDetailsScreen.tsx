import React, {useEffect, useState} from 'react';
import {
  View,
  ImageBackground,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Modal,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {addToCart} from '../redux/actions';
import TransparentView from '../components/common/TransparentView';
import Footer from '../components/common/Footer';
import constants from '../constants/Constants';
import {useRoute} from '@react-navigation/native';
import QualitiesView from '../components/details-screen/QualitiesView';
import axios from 'axios';

const PokemonDetailsScreen = () => {
  const route = useRoute<any>();
  const itemId = route.params.id;
  const heading = route.params.name;

  const [showModal, setShowModal] = useState<boolean>(false);
  const [data, setData] = useState<any>([]);

  const dispatch = useDispatch();
  const cartData = useSelector((state: any) => state.cart);
  useEffect(() => {
    fetchData(); // Initial data fetch
  }, []);

  const fetchData = () => {
    setShowModal(true);
    // Show modal when making API call
    axios
      .get(`https://pokeapi.co/api/v2/pokemon/${itemId}`)
      .then((response: any) => {
        setData(response.data);
      })
      .catch((error: any) => {
        console.error('Error while fetching pokemon detail api:', error);
      })
      .finally(() => {
        setShowModal(false); // Hide modal when response is received
      });
  };

  //It will check if same id pokemon exists, if it exists it will add to its quanitity otherwise new object will be created
  const storeData = () => {
    const existingCartItem = cartData.items.find(
      (item: any) => item.id === itemId,
    );

    if (existingCartItem) {
      const updatedItems = cartData.items.map((item: any) => {
        if (item.id === itemId) {
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }
        return item;
      });

      dispatch({
        type: 'UPDATE_CART',
        payload: updatedItems,
      });
    } else {
      dispatch(
        addToCart({
          id: data.id,
          // image: props.data.image,
          heading: data.name,
          buttonLabel: 'Price',
          quantity: 1,
          price: 3.3,
        }),
      );
    }
  };

  return (
    <View style={styles.mainContainer}>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <ImageBackground
            source={{
              uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcqO2v1-ZjkPk7SvE8v_c03g_nqmJXiFC8Fg&usqp=CAU',
            }}
            resizeMode={'stretch'}
            style={styles.image}>
            <TransparentView
              headingText={heading}
              height={data.height}
              weight={data.weight}
            />
          </ImageBackground>
        </View>
        <View style={styles.body}>
          <View style={styles.rowContainer}>
            <QualitiesView
              heading={'Abilities'}
              qualitiesStyle={{borderRightWidth: 2}}
              data={data.abilities}
              qualityName={'ability'}
              qualityKey={'name'}
            />
            <QualitiesView
              heading={'Species'}
              data={data.species}
              qualityName={'specie'}
              qualityKey={'name'}
            />
          </View>
          <View style={styles.rowContainer}>
            <QualitiesView
              heading={'Moves'}
              qualitiesStyle={{borderRightWidth: 2}}
              data={data.moves}
              qualityName={'move'}
              qualityKey={'name'}
            />
            <QualitiesView
              heading={'Types'}
              data={data.types}
              qualityName={'type'}
              qualityKey={'name'}
            />
          </View>
        </View>
      </ScrollView>
      <Footer
        price={3.3} // Set your price here
        buttonLabel={'Add to Cart'}
        functionOnPress={storeData}
      />
      {/* Modal with Activity Indicator */}
      <Modal animationType="fade" transparent={true} visible={showModal}>
        <View style={styles.modalContainer}>
          <ActivityIndicator size="large" color={constants.colors.lightPeach} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    height: '100%',
  },
  scrollContainer: {
    backgroundColor: constants.colors.background,
    height: '80%',
  },
  imageContainer: {
    height: 350,
    width: '100%',
  },
  image: {
    height: '100%',
  },
  transparentContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    bottom: 0,
    height: 140,
    width: '100%',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingHorizontal: '5%',
    paddingTop: 15,
  },
  body: {
    paddingHorizontal: '5%',
    paddingVertical: '4%',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 70,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PokemonDetailsScreen;
