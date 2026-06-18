import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  useLocalSearchParams,
  router,
} from "expo-router";
import api from "../services/api";

export default function EditProfile() {
  const { userId } =
    useLocalSearchParams();

  const [name, setName] =
    useState("");
  const [email, setEmail] =
    useState("");
  const [mobileNumber, setMobileNumber] =
    useState("");
  const [address, setAddress] =
    useState("");
  const [password, setPassword] =
    useState("");

  const [image, setImage] =
    useState<any>(null);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response =
        await api.get(`/user/${userId}`);

      const user =
        response.data.user;

      setName(user.name || "");
      setEmail(user.email || "");
      setMobileNumber(
        user.mobileNumber || ""
      );
      setAddress(
        user.address || ""
      );

      if (user.image) {
        setImage({
          uri: `${api.defaults.baseURL}/images/${user.image}`,
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const pickImage = async () => {
    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes:
          ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

    if (!result.canceled) {
      setImage(
        result.assets[0]
      );
    }
  };

  const updateProfile = async () => {
    try {
      const formData =
        new FormData();

      formData.append(
        "name",
        name
      );

      formData.append(
        "email",
        email
      );

      formData.append(
        "mobileNumber",
        mobileNumber
      );

      formData.append(
        "address",
        address
      );

      if (password.trim()) {
        formData.append(
          "password",
          password
        );
      }

      if (
        image &&
        image.uri &&
        !image.uri.includes(
          "/images/"
        )
      ) {
        formData.append(
          "image",
          {
            uri: image.uri,
            name:
              "profile.jpg",
            type:
              "image/jpeg",
          } as any
        );
      }

      const response =
        await api.put(
          `/user/${userId}`,
          formData,
          {
            headers: {
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

      Alert.alert(
        "Success",
        response.data.message
      );

      router.replace({
        pathname:
          "/user-profile",
        params: { userId },
      });
    } catch (error: any) {
      console.log(
        error.response?.data
      );

      Alert.alert(
        "Error",
        error.response?.data
          ?.message ||
          "Update failed"
      );
    }
  };

  return (
    <ScrollView
      style={styles.container}
    >
      <TouchableOpacity
        onPress={pickImage}
      >
        <Image
          source={
            image
              ? image
              : {
                  uri: "https://via.placeholder.com/150",
                }
          }
          style={
            styles.profileImage
          }
        />
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Name"
        placeholderTextColor="#94a3b8"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#94a3b8"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Mobile Number"
        placeholderTextColor="#94a3b8"
        value={mobileNumber}
        onChangeText={
          setMobileNumber
        }
      />

      <TextInput
        style={styles.input}
        placeholder="Address"
        placeholderTextColor="#94a3b8"
        value={address}
        onChangeText={
          setAddress
        }
      />

      <TextInput
        style={styles.input}
        placeholder="New Password"
        placeholderTextColor="#94a3b8"
        secureTextEntry
        value={password}
        onChangeText={
          setPassword
        }
      />

      <TouchableOpacity
        style={styles.button}
        onPress={
          updateProfile
        }
      >
        <Text
          style={
            styles.buttonText
          }
        >
          Save Changes
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles =
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:
        "#0f172a",
      padding: 20,
    },

    profileImage: {
      width: 140,
      height: 140,
      borderRadius: 70,
      alignSelf: "center",
      marginTop: 30,
      marginBottom: 25,
    },

    input: {
      backgroundColor:
        "#1e293b",
      color: "#fff",
      padding: 15,
      borderRadius: 12,
      marginBottom: 15,
    },

    button: {
      backgroundColor:
        "#10b981",
      padding: 16,
      borderRadius: 12,
      marginTop: 10,
    },

    buttonText: {
      color: "#fff",
      textAlign:
        "center",
      fontWeight:
        "bold",
      fontSize: 16,
    },
  });