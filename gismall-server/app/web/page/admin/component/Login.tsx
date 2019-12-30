import React, { useState } from 'react';
import firebase from 'firebase';
import { Form, Icon, Input, Button, Checkbox, message } from 'antd';
import { withRouter, RouteComponentProps } from 'react-router';

import { post } from '../../../utils/fetch';

import styles from './Login.module.less';
import { WrappedFormUtils } from 'antd/lib/form/Form';
import { CustomClaims } from '../../../../typings/common';

interface InjectedProps {
  form: WrappedFormUtils<{}>;
}

type Props = RouteComponentProps & InjectedProps;

const itemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
    lg: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
    lg: { span: 18 },
  },
};

const itemButtonLayout = {
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16, push: 8 },
    lg: { span: 18, push: 6 },
  },
};

function Login({ form, history }: Props) {
  const { getFieldDecorator, validateFields } = form;
  const [isLoging, setIsLoging] = useState(false);
  return (
    <div className={styles.container}>
      <div className={styles.panelLogin}>
        <h2>Log In</h2>
        <Form
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
            e.preventDefault();
            e.stopPropagation();
            validateFields(
              ['email', 'password'],
              async (
                error: any,
                { email, password }: { password: string; email: string }
              ) => {
                if (!error) {
                  try {
                    const auth = firebase.auth();
                    await auth.signInWithEmailAndPassword(email, password);
                    const token = await auth.currentUser?.getIdToken(true);
                    const response = await post<CustomClaims>(
                      '/admin/api/v3/verify',
                      {
                        token: token,
                      }
                    );
                    if (response.data) {
                      if (response.data.role === 'administrator') {
                        history.replace('/admin');
                      } else {
                        message.error(
                          'Please log in with a administrator user!'
                        );
                      }
                    }
                    setIsLoging(true);
                  } catch (ex) {
                    message.error(ex);
                  } finally {
                    setIsLoging(false);
                  }
                }
              }
            );
            return false;
          }}
          className="login-form"
        >
          <Form.Item label="Username" {...itemLayout}>
            {getFieldDecorator('email', {
              rules: [
                {
                  required: true,
                  message: 'Please input your email!',
                },
              ],
            })(
              <Input
                prefix={
                  <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                placeholder="Email"
              />
            )}
          </Form.Item>
          <Form.Item label="Password" {...itemLayout}>
            {getFieldDecorator('password', {
              rules: [
                { required: true, message: 'Please input your Password!' },
              ],
            })(
              <Input
                prefix={
                  <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                type="password"
                placeholder="Password"
              />
            )}
          </Form.Item>
          <Form.Item {...itemButtonLayout}>
            <div>
              {getFieldDecorator('remember', {
                valuePropName: 'checked',
                initialValue: true,
              })(<Checkbox>Remember me</Checkbox>)}
              <a className={styles.forgotPassword} href="">
                Forgot password
              </a>
            </div>
            <div className={styles.btnRow}>
              <Button
                type="primary"
                htmlType="submit"
                className={styles.btnSubmit}
                loading={isLoging}
              >
                Log in
              </Button>
              <Button
                type="primary"
                htmlType="button"
                className={styles.btnLoginWithGoogle}
                icon="google"
              >
                Google
              </Button>
              <Button
                type="primary"
                htmlType="button"
                className={styles.btnLoginWithFacebook}
                icon="facebook"
              >
                Facebook
              </Button>
            </div>
            <div>
              Or <a href="">register now!</a>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default Form.create({ name: 'login_form' })(withRouter(Login));
