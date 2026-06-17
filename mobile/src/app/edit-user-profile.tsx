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

```
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
  console.log(
    "FETCH USER ERROR:",
    error
  );
}
```

};

const pickImage = async () => {
const result =
await ImagePicker.launchImageLibraryAsync({
mediaTypes:
ImagePicker.MediaTypeOptions.Images,
quality: 1,
});

```
if (!result.canceled) {
  setImage(
    result.assets[0]
  );
}
```

};

const updateProfile = async () => {
if (
!name.trim() ||
!email.trim()
) {
Alert.alert(
"Validation",
"Name and Email are required"
);
return;
}

```
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
    "Profile Updated Successfully"
  );

  router.replace({
    pathname:
      "/user-profile",
    params: {
      userId,
    },
  });
} catch (error: any) {
  console.log(
    "UPDATE ERROR:",
    error.response?.data
  );

  Alert.alert(
    "Error",
    error.response?.data
      ?.message ||
      "Update failed"
  );
}
```

};

return (
<ScrollView
style={styles.container}
contentContainerStyle={{
paddingBottom: 40,
}}
> <Text style={styles.title}>
Edit Profile </Text>

```
  <TouchableOpacity
    onPress={pickImage}
  >
    <Image
      source={{
        uri:
          image?.uri ||
          "https://via.placeholder.com/150",
      }}
      style={
        styles.profileImage
      }
    />
  </TouchableOpacity>

  <Text
    style={styles.changePhoto}
  >
    Tap image to change profile photo
  </Text>

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
```

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

```
title: {
  color: "#10b981",
  fontSize: 30,
  fontWeight: "bold",
  textAlign: "center",
  marginTop: 20,
  marginBottom: 20,
},

profileImage: {
  width: 150,
  height: 150,
  borderRadius: 75,
  alignSelf: "center",
  marginBottom: 10,
  borderWidth: 3,
  borderColor: "#10b981",
},

changePhoto: {
  color: "#94a3b8",
  textAlign: "center",
  marginBottom: 25,
  fontSize: 14,
},

input: {
  backgroundColor:
    "#1e293b",
  color: "#ffffff",
  padding: 15,
  borderRadius: 12,
  marginBottom: 15,
  fontSize: 16,
},

button: {
  backgroundColor:
    "#10b981",
  padding: 16,
  borderRadius: 12,
  marginTop: 10,
},

buttonText: {
  color: "#ffffff",
  textAlign: "center",
  fontWeight: "bold",
  fontSize: 18,
},
```

});
