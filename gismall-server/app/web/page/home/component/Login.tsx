import React, { useEffect, useRef } from 'react';
import firebase from 'firebase';

interface Props {
  providerId: string;
}

export default function Login(props: Props) {
  const { providerId } = props;
  const el = useRef<HTMLDivElement>(null);
  return <div ref={el}></div>;
}
