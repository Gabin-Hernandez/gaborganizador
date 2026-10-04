'use client';

import React, { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, icon?: string, color?: string) => Promise<void>;
}

export const CategoryModal: React.FC<CategoryModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('El nombre de la categoría es obligatorio');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await onSubmit(name.trim());
      setName('');
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Crear nueva categoría">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre de la categoría"
          placeholder="Ej. Transporte, Mascota, Salud"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setError('');
          }}
          error={error}
        />
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Guardar categoría
          </Button>
        </div>
      </form>
    </Modal>
  );
};
