declare module 'react-qr-scanner' {
    import { Component } from 'react';
  
    interface QrReaderProps {
      delay?: number;
      style?: React.CSSProperties;
      onError?: (error: Error) => void;
      onScan?: (data: any) => void; // Adjust this based on what data type you expect
    }
  
    export default class QrReader extends Component<QrReaderProps> {}
  }
  