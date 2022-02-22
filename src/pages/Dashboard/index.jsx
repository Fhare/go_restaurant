import { useState, useEffect } from "react";

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import { ModalEditFood } from '../../components/ModalEditFood';

import { FoodsContainer } from './styles';

export function Dashboard(props) {

  const [foods, setFoods] = useState([]);
  const [editingFood, setEditingFood] = useState({});

  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  async function getFoods() {
    const response = await api.get("/foods");
    const data = response.data;

    setFoods(data);
  };

  // handleAddFood = async food => {
  //   const { foods } = this.state;

  //   try {
  //     const response = await api.post('/foods', {
  //       ...food,
  //       available: true,
  //     });

  //     this.setState({ foods: [...foods, response.data] });
  //   } catch (err) {
  //     console.log(err);
  //   }

  // handleUpdateFood = async food => {
  //   const { foods, editingFood } = this.state;

  //   try {
  //     const foodUpdated = await api.put(
  //       `/foods/${editingFood.id}`,
  //       { ...editingFood, ...food },
  //     );

  //     const foodsUpdated = foods.map(f =>
  //       f.id !== foodUpdated.data.id ? f : foodUpdated.data,
  //     );

  //     this.setState({ foods: foodsUpdated });
  //   } catch (err) {
  //     console.log(err);
  //   }
  // }

  // handleDeleteFood = async id => {
  //   const { foods } = this.state;

  //   await api.delete(`/foods/${id}`);

  //   const foodsFiltered = foods.filter(food => food.id !== id);

  //   this.setState({ foods: foodsFiltered });
  // }

  function toggleModal() {
    setModalOpen(!modalOpen);
  };

  function toggleEditModal() {
    setEditModalOpen(!editModalOpen);
  };

  function handleEditFood(food) {
    setEditingFood({ editingFood: food, editModalOpen: true });
  };

  // const { modalOpen, editModalOpen, editingFood, foods } = this.state;

  useEffect(() => {
    getFoods();
  }, []);

  return (
    <>
      <Header openModal={toggleModal} />

      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
      // handleAddFood={this.handleAddFood}
      />

      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={() => handleEditFood(foods)}
      />

      <FoodsContainer data-testid="foods-list">
        {foods.map(food => (
            <Food
              key={food.id}
              food={food}
            // handleDelete={this.handleDeleteFood}
            // handleEditFood={this.handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
};