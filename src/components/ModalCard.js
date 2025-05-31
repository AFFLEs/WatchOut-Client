// src/components/ReusableModal.js
import React from 'react';
import { Modal, View, Text, StyleSheet } from 'react-native';

export default function ModalCard({
  visible,
  title,
  children,
  buttons,
  onRequestClose,
  width = 280,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onRequestClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.box, { width }]}>
          {title ? <Text style={styles.title}>{title}</Text> : null}
          {children}
          <View style={styles.btnRow}>
            {buttons && buttons.map((btn, idx) => (
              <View key={idx} style={{ flex: 1 }}>
                {btn}
              </View>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding:20,
    alignItems: 'flex-start',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 12,
    color: '#222B3A',
    textAlign: 'center',
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 10,
  },
});