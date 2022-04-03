import { useState, useEffect } from "react";

import { Header } from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import { ModalEditFood } from '../../components/ModalEditFood';

import { FoodsContainer } from './styles';

interface foodProps {
  id: number;
  name: string;
  description: string;
  price: number,
  available: boolean,
  image: string;
}

export function Dashboard() {

  const [foods, setFoods] = useState<foodProps[]>([]);
  const [editingFood, setEditingFood] = useState<foodProps>({} as foodProps);

  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  async function getFoods() {
    const response = await api.get("/foods");
    const data = response.data;

    setFoods(data);
  };

  function toggleModal() {
    setModalOpen(!modalOpen);
  };

  function toggleEditModal() {
    setEditModalOpen(!editModalOpen);
  };

  async function handleAddFood(food: foodProps) {
    try {
      const response = await api.post('/foods', { ...food, available: true });
      const newFood = response.data;

      setFoods([...foods, newFood]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food: foodProps) {
    try {
      const foodUpdated = await api.put(`/foods/${editingFood.id}`, { ...editingFood, ...food });

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setFoods(foodsUpdated);
    } catch (err) {
      console.log(err);
    }
  };

  async function handleDeleteFood(id: number) {
    await api.delete(`/foods/${id}`);
    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }

  function handleEditFood(food: foodProps) {
    setEditingFood(food);
    setEditModalOpen(true);
  }

  useEffect(() => {
    getFoods();
  }, []);

  return (
    <>
      <Header openModal={toggleModal} />

      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />

      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods.map(food => (
          <Food
            key={food.id}
            food={food}
            handleDelete={handleDeleteFood}
            handleEditFood={handleEditFood}
          />
        ))}
      </FoodsContainer>
    </>
  );
};