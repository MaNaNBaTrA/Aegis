import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, Linking, Platform } from 'react-native';
import React, { useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import Loader from '../../components/Loader';

const Profile = () => {
  const { signOut } = useAuth();
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const showError = (message) => {
    setError(message);
    setTimeout(() => {
      setError(null);
    }, 3000); 
  };

  const showSuccess = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage(null);
    }, 3000);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.replace('/sign-in');
    } catch (err) {
      console.error('Error signing out:', err);
      showError('Failed to sign out. Please try again.');
    }
  };

  const handleDeleteAccount = () => {
    setConfirmDialog({
      visible: true,
      title: 'Delete Account',
      message: 'Are you sure you want to delete your account? This action cannot be undone.',
      onConfirm: async () => {
        try {
          await user.delete();
          router.replace('/sign-in');
        } catch (err) {
          console.error('Error deleting account:', err);
          showError('Failed to delete account. Please try again.');
        }
      }
    });
  };

  const handleChangeProfilePicture = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        setIsUpdating(true);
        const imageUrl = result.assets[0].uri;
        await user.update({
          unsafeMetadata: {
            ...user.unsafeMetadata,
            profileImageUrl: imageUrl,
          },
        });
        setIsUpdating(false);
      }
    } catch (err) {
      console.error('Error updating profile picture:', err);
      showError('Failed to update profile picture. Please try again.');
      setIsUpdating(false);
    }
  };

  const handleChangeName = () => {
    router.push('/update-name');
  };

  const handleChangePassword = () => {
    router.push('/change-password');
  };

  const handleReportError = () => {
    Linking.openURL('mailto:mananbatradev@gmail.com?subject=Error Report - Aegis');
  };

  const handleSupportDeveloper = () => {
    const upiId = "mananbatra162004@oksbi"; 
    const name = "Arthur"; 
    const amount = ""; 
    const note = "Support for future Projects"; 
    
    const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${encodeURIComponent(note)}`;
    
    Linking.canOpenURL(upiUrl).then(supported => {
      if (supported) {
        Linking.openURL(upiUrl);
      } else {
        if (Platform.OS === 'android') {
          Linking.openURL('https://pay.google.com');
        } else {
          showError('UPI payment apps not found. Please install a UPI app to support.');
        }
      }
    }).catch(err => {
      console.error('Error opening UPI app:', err);
      showError('Could not open payment app. Please try again later.');
    });
  };

  const [confirmDialog, setConfirmDialog] = useState({
    visible: false,
    title: '',
    message: '',
    onConfirm: null
  });

  const ErrorMessage = ({ message }) => {
    if (!message) return null;
    
    return (
      <View style={styles.messageContainer}>
        <MaterialIcons name="error-outline" size={20} color="#fff" />
        <Text style={styles.messageText}>{message}</Text>
      </View>
    );
  };
  
  const SuccessMessage = ({ message }) => {
    if (!message) return null;
    
    return (
      <View style={[styles.messageContainer, styles.successContainer]}>
        <MaterialIcons name="check-circle" size={20} color="#fff" />
        <Text style={styles.messageText}>{message}</Text>
      </View>
    );
  };

  const ConfirmDialog = ({ visible, title, message, onConfirm, onCancel }) => {
    if (!visible) return null;
    
    return (
      <View style={styles.confirmDialogOverlay}>
        <View style={styles.confirmDialogContainer}>
          <Text style={styles.confirmDialogTitle}>{title}</Text>
          <Text style={styles.confirmDialogMessage}>{message}</Text>
          <View style={styles.confirmDialogButtons}>
            <TouchableOpacity 
              style={[styles.confirmDialogButton, styles.cancelButton]} 
              onPress={() => setConfirmDialog({...confirmDialog, visible: false})}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.confirmDialogButton, styles.confirmButton]} 
              onPress={() => {
                setConfirmDialog({...confirmDialog, visible: false});
                onConfirm && onConfirm();
              }}
            >
              <Text style={styles.confirmButtonText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const MenuOption = ({ icon, title, onPress, color = '#333' }) => (
    <TouchableOpacity style={styles.menuOption} onPress={onPress}>
      <View style={styles.menuIconContainer}>
        <MaterialIcons name={icon} size={24} color={color} />
      </View>
      <Text style={[styles.menuText, { color }]}>{title}</Text>
      <MaterialIcons name="chevron-right" size={24} color="#666" />
    </TouchableOpacity>
  );

  if (!isLoaded) {
    return <Loader />;
  }

  const profileImageUrl = user?.unsafeMetadata?.profileImageUrl || user?.imageUrl;

  return (
    <ScrollView style={styles.container}>
      {error && <ErrorMessage message={error} />}
      {successMessage && <SuccessMessage message={successMessage} />}
      
      <View style={styles.profileSection}>
        <TouchableOpacity 
          onPress={handleChangeProfilePicture}
          style={styles.imageContainer}
        >
          {profileImageUrl ? (
            <Image
              source={{ uri: profileImageUrl }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.noImageContainer}>
              <Text style={styles.noImageText}>
                {user.firstName?.[0] || user.lastName?.[0] || '?'}
              </Text>
            </View>
          )}
          <View style={styles.editBadge}>
            <MaterialIcons name="edit" size={16} color="#fff" />
          </View>
        </TouchableOpacity>

        <Text style={styles.userName}>{user.firstName} {user.lastName}</Text>
        <Text style={styles.userEmail}>{user.primaryEmailAddress?.emailAddress}</Text>

        <View style={styles.menuContainer}>
          <View style={styles.menuSection}>
            <Text style={styles.menuSectionTitle}>Account Settings</Text>
            <MenuOption icon="person" title="Change Name" onPress={handleChangeName} />
            <MenuOption icon="lock" title="Change Password" onPress={handleChangePassword} />
          </View>

          <View style={styles.menuSection}>
            <Text style={styles.menuSectionTitle}>Support</Text>
            <MenuOption icon="error-outline" title="Report an Error" onPress={handleReportError} />
            <MenuOption icon="payments" title="Support Developer" onPress={handleSupportDeveloper} color="#E91E63" />
          </View>

          <View style={styles.menuSection}>
            <Text style={styles.menuSectionTitle}>Account Actions</Text>
            <MenuOption icon="logout" title="Sign Out" onPress={handleSignOut} color="#0066cc" />
            <MenuOption icon="delete-forever" title="Delete Account" onPress={handleDeleteAccount} color="#ff3b30" />
          </View>
        </View>
      </View>

      {isUpdating && (
        <View style={styles.overlay}>
          <Loader />
        </View>
      )}
      <ConfirmDialog 
        visible={confirmDialog.visible}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onConfirm={confirmDialog.onConfirm}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  profileSection: {
    padding: 20,
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    marginTop: 20,
    marginBottom: 15,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  noImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e1e1e1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  noImageText: {
    fontSize: 40,
    color: '#666',
  },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#0066cc',
    padding: 8,
    borderRadius: 20,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  userEmail: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  menuContainer: {
    width: '100%',
  },
  menuSection: {
    marginBottom: 25,
  },
  menuSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
    paddingLeft: 10,
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    marginBottom: 8,
  },
  menuIconContainer: {
    marginRight: 15,
  },
  menuText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageContainer: {
    backgroundColor: '#ff3b30',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  successContainer: {
    backgroundColor: '#34c759',
  },
  messageText: {
    color: '#fff',
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  confirmDialogOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  confirmDialogContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '80%',
    alignItems: 'center',
  },
  confirmDialogTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  confirmDialogMessage: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  confirmDialogButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  confirmDialogButton: {
    padding: 12,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f1f1f1',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: '600',
  },
  confirmButton: {
    backgroundColor: '#ff3b30',
  },
  confirmButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default Profile;