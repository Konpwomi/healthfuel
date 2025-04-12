import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Pencil, Camera, ImagePlus } from "lucide-react-native";
import * as ImagePicker from "expo-image-picker";
import { useProfile, ProfileData } from "../../context/profileContext";
import { useAuth } from "../../context/authContext";

type ProfileField = keyof Omit<ProfileData, "profilePicture">;

const ProfilePage = () => {
  const { profileData, updateProfileData, isLoading, error, refreshProfileData } = useProfile();
  // Initialize with null instead of profileData to prevent the state update warning
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const { logout } = useAuth();

  // Use effect to update local state if context profileData changes
  useEffect(() => {
    if (profileData) {
      setProfile(profileData);
    }
  }, [profileData]);

  const [modalVisible, setModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState<ProfileField | null>(null);
  const [tempValue, setTempValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  // Handle loading state - also check if profile is still null
  if (isLoading || !profile) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#1EAFB3" />
        <Text className="mt-4 text-gray-600">Loading your profile...</Text>
      </View>
    );
  }

  // Handle error state
  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-white p-6">
        <Text className="text-xl font-bold text-gray-800 mb-2">Oops!</Text>
        <Text className="text-base text-gray-600 text-center mb-6">
          {error || "Unable to load your profile information"}
        </Text>
        <TouchableOpacity 
          onPress={refreshProfileData}
          className="bg-primary px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-semibold">Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const resetModalState = () => {
    setModalVisible(false);
    setCurrentField(null);
    setTempValue("");
    setShowDropdown(false);
  };

  const openEditModal = (field: ProfileField) => {
    setCurrentField(field);
    setTempValue(String(profile[field]));
    setModalVisible(true);
  };

  const handleModalSave = () => {
    if (!currentField) return;

    const value = tempValue.trim();
    const numericFields = ["age", "weight", "height"];

    if (numericFields.includes(currentField)) {
      const num = Number(value);
      if (isNaN(num)) {
        Alert.alert("Invalid input", "Please enter a number.");
        return;
      }

      const validationRanges = {
        age: { min: 0, max: 120, message: "valid age between 0 and 120" },
        weight: {
          min: 0,
          max: 500,
          message: "valid weight between 0 and 500 kg",
        },
        height: {
          min: 0,
          max: 300,
          message: "valid height between 0 and 300 cm",
        },
      };

      const range =
        validationRanges[currentField as keyof typeof validationRanges];
      if (num < range.min || num > range.max) {
        Alert.alert(
          `Invalid ${currentField}`,
          `Please enter a ${range.message}`
        );
        return;
      }

      const updatedProfile = { ...profile, [currentField]: num };
      setProfile(updatedProfile);
      updateProfileData({ [currentField]: num })
        .catch(err => Alert.alert("Update Failed", err.message));
    } else {
      const updatedProfile = { ...profile, [currentField]: value };
      setProfile(updatedProfile);
      updateProfileData({ [currentField]: value })
        .catch(err => Alert.alert("Update Failed", err.message));
    }

    resetModalState();
  };

  const handleImageSelection = async (useCamera: boolean) => {
    const permissionType = useCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionType.granted) {
      Alert.alert(
        "Permission Required",
        `Allow access to ${useCamera ? "camera" : "photos"} to ${
          useCamera ? "take" : "upload"
        } a profile picture`
      );
      return;
    }

    const pickerFunction = useCamera
      ? ImagePicker.launchCameraAsync
      : ImagePicker.launchImageLibraryAsync;

    const result = await pickerFunction({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length > 0) {
      const newProfilePicture = result.assets[0].uri;
      setProfile({ ...profile, profilePicture: newProfilePicture });
      updateProfileData({ profilePicture: newProfilePicture })
        .catch(err => Alert.alert("Update Failed", err.message));
    }
  };

  const ProfileFieldRow = ({
    label,
    value,
    field,
  }: {
    label: string;
    value: string | number;
    field: ProfileField;
  }) => (
    <View className="mb-4 border-b border-gray-200 pb-2">
      <Text className="text-gray-600 mb-1">{label}</Text>
      <View className="flex-row items-center justify-between">
        <Text className="text-lg">{value}</Text>
        <TouchableOpacity onPress={() => openEditModal(field)} className="p-2">
          <Pencil color="#1EAFB3" size={20} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-6 items-center">
        <Text className="text-2xl font-bold mt-4 mb-8 text-primary">
          Profile Details
        </Text>
        {/* Profile Header */}
        <View className="items-center mb-8">
          {/* Profile Image */}
          <Image
            source={{ 
              uri: profile.profilePicture || 
                  "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png" 
            }}
            className="w-32 h-32 rounded-full"
          />

          {/* Camera Buttons positioned below image */}
          <View className="flex-row justify-center gap-1 mt-3 space-x-3">
            <TouchableOpacity
              onPress={() => handleImageSelection(true)}
              className="bg-primary px-3 py-2 rounded-md flex-row items-center"
              accessibilityLabel="Take photo with camera"
            >
              <Camera color="white" size={16} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleImageSelection(false)}
              className="bg-primary px-3 py-2 rounded-md flex-row items-center"
              accessibilityLabel="Upload from gallery"
            >
              <ImagePlus color="white" size={16} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile Info Card */}
        <View className="bg-white rounded-lg shadow p-4 w-full max-w-md">
          <ProfileFieldRow label="Name" value={profile.name} field="name" />
          <ProfileFieldRow label="Age" value={profile.age} field="age" />
          <ProfileFieldRow label="Gender" value={profile.gender} field="gender" />
          <ProfileFieldRow
            label="Weight"
            value={`${profile.weight} kg`}
            field="weight"
          />
          <ProfileFieldRow
            label="Height"
            value={`${profile.height} cm`}
            field="height"
          />
        </View>
      </View>

      {/* Edit Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/40 px-4">
          <View className="bg-white w-full max-w-md p-6 rounded-2xl shadow-lg">
            <Text className="text-xl font-semibold mb-4 capitalize text-center text-gray-800">
              Edit {currentField}
            </Text>

            {currentField === "gender" ? (
              <View className="mb-4">
                <TouchableOpacity
                  className="border border-gray-300 p-3 rounded-md flex-row justify-between items-center"
                  onPress={() => setShowDropdown(!showDropdown)}
                >
                  <Text className="text-base text-black">
                    {tempValue || "Select option"}
                  </Text>
                  <Text className="text-gray-500">
                    {showDropdown ? "▲" : "▼"}
                  </Text>
                </TouchableOpacity>

                {showDropdown && (
                  <View className="border border-gray-300 rounded-md mt-1 bg-white shadow-md">
                    {["male", "female", "other"].map((option) => (
                      <TouchableOpacity
                        key={option}
                        onPress={() => {
                          setTempValue(option);
                          setShowDropdown(false);
                        }}
                        className={`p-3 ${
                          option !== "other" ? "border-b border-gray-200" : ""
                        }`}
                      >
                        <Text
                          className={`text-base capitalize ${
                            tempValue === option
                              ? "text-primary font-semibold"
                              : "text-black"
                          }`}
                        >
                          {option}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            ) : (
              <TextInput
                className="border border-gray-300 p-3 rounded-md text-base text-black"
                value={tempValue}
                onChangeText={setTempValue}
                keyboardType={
                  ["age", "weight", "height"].includes(currentField || "")
                    ? "numeric"
                    : "default"
                }
                placeholder={`Enter ${currentField}`}
                placeholderTextColor="#9CA3AF"
              />
            )}

            {/* Modal Buttons */}
            <View className="flex-row justify-end mt-6 space-x-3">
              <TouchableOpacity
                onPress={resetModalState}
                className="px-5 py-2 rounded-md bg-gray-200"
              >
                <Text className="text-gray-700 font-medium">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleModalSave}
                className="px-5 py-2 rounded-md bg-primary ml-3"
              >
                <Text className="text-white font-semibold">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <TouchableOpacity
        onPress={logout}
        className="bg-red-500 mx-10 py-4 rounded-lg mt-7 mb-11"
      >
        <Text className="text-white text-center font-bold">Sign Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProfilePage;