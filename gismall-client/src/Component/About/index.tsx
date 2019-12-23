import React, { useState, useReducer } from 'react';
import {
  Image,
  ScrollView,
  TouchableOpacity,
  View,
  Platform,
} from 'react-native';
import { connect } from 'react-redux';
import {
  Button,
  InputItem,
  List,
  Toast,
  Progress,
} from '@ant-design/react-native';
import ImagePicker, { ImagePickerResponse } from 'react-native-image-picker';

import i18n from '../../i18n';
import { logout, updateProfile } from '../../action';
import firebase, { RNFirebase } from 'react-native-firebase';
import { getFileNameWithoutExt } from '../../utils/path';
import { TaskEvent, TaskState } from '../../utils/firebase';
import NavigationBar from '../NavigationBar';

const defaultAvatar = require('../../imgs/avatar-male.jpeg');

interface DispatchProps {
  logout: () => Promise<any>;
}

interface InjectedProps {
  userCredential: Redux.UserInformation;
}

type Props = DispatchProps & InjectedProps;

interface State {
  bytesTransferred: number;
  downloadURL: string | null;
  metadata: RNFirebase.storage.FullMetadata;
  state: RNFirebase.storage.TaskState;
  totalBytes: number;
}

interface Action<T, P> {
  type: T;
  payload: P;
}

enum ACTION_TYPE {
  ACTION_UPLOAD_PROGRESS = 'upload_progress',
  ACTION_UPLOAD_SUCCESS = 'upload_success',
}

const reducer = (
  state: State | null = null,
  action: Action<ACTION_TYPE, RNFirebase.storage.UploadTaskSnapshot>,
) => {
  const { type, payload } = action;
  switch (type) {
    case ACTION_TYPE.ACTION_UPLOAD_PROGRESS:
      const { ref, task, ...extra } = payload;
      return extra;
      break;
    case ACTION_TYPE.ACTION_UPLOAD_SUCCESS:
      return null;
    default:
      return state;
  }
};

function About({ logout, userCredential }: Props) {
  const { userInfo } = userCredential;
  const [isSignOutting, setIsSignOutting] = useState(false);
  const [email, setEmail] = useState(userInfo.email);
  const [displayName, setDisplayName] = useState(userInfo.displayName);
  const [photoURL, setPhotoURL] = useState(userInfo.photoURL);
  const [uploadSnapshot, dispatch] = useReducer(reducer, null);

  return (
    <View>
      <NavigationBar showBackIcon={false} title={i18n.t('navigations.me')} />
      <ScrollView>
        <View
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            marginTop: 10,
            marginBottom: 10,
            alignContent: 'center',
          }}
        >
          <TouchableOpacity
            onPress={() => {
              ImagePicker.showImagePicker(
                {
                  noData: true,
                  title: 'Select Avatar',
                  allowsEditing: true,
                  storageOptions: {
                    cameraRoll: true,
                    waitUntilSaved: true,
                  },
                },
                (res: ImagePickerResponse) => {
                  if (!res.didCancel && !res.error) {
                    let path = res.uri;
                    if (Platform.OS === 'android') {
                      path = res.path || '';
                    } else if (Platform.OS === 'ios') {
                      path = res.uri.replace('file://', '');
                    }
                    let suceseed = false;
                    const task = firebase
                      .storage()
                      .ref(`/avatar/${getFileNameWithoutExt(path)}`)
                      .putFile(path);
                    task.on(
                      TaskEvent.STATE_CHANGED,
                      (snapshot: RNFirebase.storage.UploadTaskSnapshot) => {
                        if (suceseed) {
                          return snapshot;
                        }
                        if (snapshot.state === TaskState.SUCCESS) {
                          suceseed = true;
                          dispatch({
                            type: ACTION_TYPE.ACTION_UPLOAD_SUCCESS,
                            payload: snapshot,
                          });
                          const photoURL = snapshot.downloadURL || '';
                          const p = updateProfile({
                            photoURL,
                          });
                          if (p) {
                            p.then(() => {
                              setPhotoURL(photoURL);
                            });
                          }
                        } else if (snapshot.state === TaskState.RUNNING) {
                          dispatch({
                            type: ACTION_TYPE.ACTION_UPLOAD_PROGRESS,
                            payload: snapshot,
                          });
                        }
                      },
                    );
                  }
                },
              );
            }}
          >
            <Image
              style={{
                width: 160,
                height: 160,
                resizeMode: 'stretch',
                marginBottom: 6,
                marginLeft: 'auto',
                marginRight: 'auto',
              }}
              source={
                photoURL
                  ? {
                      uri: photoURL,
                    }
                  : defaultAvatar
              }
            />
          </TouchableOpacity>
          {!!uploadSnapshot && (
            <Progress
              percent={
                uploadSnapshot.bytesTransferred / uploadSnapshot.totalBytes
              }
              style={{ width: 160, marginLeft: 'auto', marginRight: 'auto' }}
            />
          )}
        </View>
        <List style={{ marginBottom: 10 }}>
          <InputItem
            labelNumber={7}
            value={email}
            onChange={setEmail}
            editable={false}
          >
            {i18n.t('email')}
          </InputItem>
          <InputItem
            labelNumber={7}
            defaultValue={displayName}
            onChange={(name: string) => {
              setDisplayName(name);
            }}
            onBlur={() => {
              const p = updateProfile({
                displayName,
              });
            }}
          >
            {i18n.t('display_name')}
          </InputItem>
          <InputItem
            labelNumber={7}
            value={userInfo.phoneNumber}
            editable={false}
          >
            {i18n.t('phone_number')}
          </InputItem>
        </List>
        <Button
          style={{ flex: 0, width: 80 }}
          size="small"
          type="primary"
          disabled={isSignOutting}
          onPress={() => {
            setIsSignOutting(true);
            logout().then(
              () => {},
              (error: Error) => {
                setIsSignOutting(false);
                Toast.fail(`${error.message},please retry`);
              },
            );
          }}
        >
          {i18n.t('sign_out')}
        </Button>
      </ScrollView>
    </View>
  );
}

const mapStateToProps = (state: Redux.AppState) => {
  const { userCredential } = state;
  return {
    userCredential,
  };
};

export default connect(
  mapStateToProps,
  {
    logout,
  },
)(About);
