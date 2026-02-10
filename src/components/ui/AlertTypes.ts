import React from 'react';

export type AlertType = 'info' | 'success' | 'error' | 'warning';

export interface AlertButton {
    text: string;
    onPress?: () => void;
    style?: 'default' | 'cancel' | 'destructive';
}

export interface AlertOptions {
    title: string;
    message: string;
    type?: AlertType;
    buttons?: AlertButton[];
    onDismiss?: () => void;
}

export interface AlertContextType {
    showAlert: (options: AlertOptions) => void;
    hideAlert: () => void;
}

export const AlertContext = React.createContext<AlertContextType | undefined>(undefined);
