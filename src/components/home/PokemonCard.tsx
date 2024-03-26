import React, {useState} from 'react';
import {View, TouchableOpacity, Text, StyleSheet, Image} from 'react-native';
import constants from '../../constants/Constants';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {addToCart} from '../../redux/actions';
import api from '../../api_calls/api';

interface PokemonCardProps {
  id?: number;
  data?: any;
}

const PokemonCard = (props: PokemonCardProps) => {
  const navigation = useNavigation<any>();
  const dispatch = useDispatch<any>();
  const cartData = useSelector((state: any) => state.cart);
  //It will check if same id pokemon exists, if it exists it will add to its quanitity otherwise new object will be created
  const storeData = () => {
    const existingCartItem = cartData.items.find((item: any) => {
      return item.id === props.id;
    });

    if (existingCartItem) {
      const updatedItems = cartData.items.map((item: any) => {
        if (item.id === props.id) {
          return {
            ...item,
            quantity: 1 + item.quantity,
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
          id: props.id,
          // image: props.data.image,
          heading: props.data.name,
          buttonLabel: 'Price',
          quantity: 1,
          price: 3.3,
        }),
      );
    }
  };

  //It will navigate to PokemonCardDetails
  const handleCardPress = () => {
    navigation.navigate('PokemonDetailsScreen', {
      id: props.id,
      name: props.data.name,
    });
  };
  return (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() => handleCardPress()}>
      <View style={styles.leftContainer}>
        <Image
          source={{
            uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcqO2v1-ZjkPk7SvE8v_c03g_nqmJXiFC8Fg&usqp=CAU',
          }}
          style={styles.image}
          resizeMode={'stretch'}
        />
      </View>
      <View style={styles.rightContainer}>
        <Text style={styles.headingText}>{props.data.name?.toUpperCase()}</Text>
        <View style={styles.cartContainer}>
          <Text style={styles.addCart}>Add to Cart</Text>

          <TouchableOpacity style={styles.cartButton} onPress={storeData}>
            <constants.svg.plus height={12} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: constants.colors.darkGray,
    borderRadius: 25,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: 10,
  },
  image: {
    flex: 1,
  },
  leftContainer: {
    width: '30%',
    aspectRatio: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  rightContainer: {
    width: '70%',
    height: '100%',
  },
  headingText: {
    color: constants.colors.white,
    marginHorizontal: 12,
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
    minHeight: 45,
    fontWeight: '700',
  },
  cartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
    marginHorizontal: 12,
  },
  addCart: {
    color: constants.colors.white,
    fontSize: 13,
    fontWeight: '600',
    fontFamily: 'Poppins-Regular',
  },
  cartButton: {
    height: 34,
    width: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: constants.colors.lightPeach,
  },
});
export default PokemonCard;
