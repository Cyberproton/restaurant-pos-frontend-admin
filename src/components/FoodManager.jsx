import React, { Component } from "react";
import FoodView from './FoodView'
import { Button, Form, Modal, Table } from "react-bootstrap";
import axios from '../axios'

export default class FoodManager extends Component {
    constructor(props) {
        super(props)
        this.onFoodViewClicked = this.onFoodViewClicked.bind(this)
        this.onFoodClicked = this.onFoodClicked.bind(this)
        this.onAddFoodFormEnable = this.onAddFoodFormEnable.bind(this)
        this.onEditFoodFormOpened = this.onEditFoodFormOpened.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
        this.onDeleteFoodConfirmation = this.onDeleteFoodConfirmation.bind(this)
        this.handleAddFood = this.handleAddFood.bind(this)
        this.handleDeleteFood = this.handleDeleteFood.bind(this)
        this.handleUpdateFood = this.handleUpdateFood.bind(this)
        this.addFood = this.addFood.bind(this)
        this.deleteFood = this.deleteFood.bind(this)
        this.updateFood = this.updateFood.bind(this)
    }

    state = {
        foods: [],
        foodSelected: null,
        foodInForm: {},
        isShowingAddFoodForm: false,
        isShowingEditFoodForm: false,
        isShowingDeleteConfirmation: false
    }

    componentDidMount() {
        axios
            .get('/api/food')
            .then((res) => {
                const foods = res.data.foods
                this.setState({
                    foods: foods
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    render() {
        const selectedFood = this.state.foodSelected
        const addForm = this.state.isShowingAddFoodForm ? this.getAddFoodForm() : <div />
        const editForm = this.state.isShowingEditFoodForm && selectedFood ? this.getEditFoodForm(selectedFood) : <div />
        const deleteConfirmation = this.state.isShowingDeleteConfirmation && selectedFood ? this.getFoodDeleteConfirmationModal(selectedFood, this.state.isShowingDeleteConfirmation) : <div />
        const foodView = selectedFood ? <FoodView key={this.state.foodSelected} food={selectedFood} onFoodViewClicked={this.onFoodViewClicked}/> : <div />
        return (
            <div className="container mt-3">
                {foodView}
                <h3>🍽 Danh sách món ăn</h3>
                <FoodList foods={this.state.foods} onFoodClicked={this.onFoodClicked} selectedFood={this.state.foodSelected}/>
                <div className="container px-1">
                    <div className="row gx-1">
                        <Button className="col m-2" onClick={this.onAddFoodFormEnable}>Thêm món</Button>
                        { selectedFood ? <Button className="col m-2" onClick={this.onEditFoodFormOpened}>Sửa món</Button> : <Button className="col m-2" disabled>Sửa món</Button> }
                        { selectedFood ? <Button className="col m-2" variant="danger" onClick={this.onDeleteFoodConfirmation}>Xóa món</Button> : <Button className="col m-2" variant="danger" disabled>Xóa món</Button>}
                    </div>
                </div>
                <hr />
                {addForm}
                {editForm}
                {deleteConfirmation}
            </div>
        );
    }

    async getAllFoods() {
        const res = await axios.get('/api/food/')
        if (res.status / 100 === 2) {
            const foods = res.data.foods
            return foods
        }
        return []
    }

    addFood(food) {
        axios
            .post('/api/food/add', food)
            .then((res) => {
                const foods = this.state.foods
                foods.push(res.data.food)
                this.setState({
                    foods: foods,
                    foodInForm: {}
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    deleteFood(food) {
        axios
            .post('/api/food/delete', food)
            .then((res) => {
                const foods = this.state.foods.filter(x => x._id != food._id)
                this.setState({
                    foods: foods,
                    foodInForm: {},
                    foodSelected: null
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    updateFood(food) {
        axios
            .post('/api/food/update', food)
            .then((res) => {
                const foods = this.state.foods
                const i = foods.findIndex(x => x._id === food._id)
                foods[i] = res.data.food
                console.log(i)
                this.setState({
                    foods: foods,
                    foodInForm: {}
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    handleInputChange(n, e) {
        const target = e.target
        const value = target.value
        const foodInForm = this.state.foodInForm
        foodInForm[n] = value

        this.setState({
            foodInForm: foodInForm
        })
    }

    handleAddFood(e) {
        e.preventDefault()
        if (this.state.foodInForm === {}) {
            return
        }
        this.addFood(this.state.foodInForm)
    }

    handleUpdateFood(e) {
        console.log(1)
        e.preventDefault()

        if (this.state.foodSelected == null) {
            return
        }

        const foodSelected = this.state.foodSelected
        const food = this.state.foodInForm
        food._id = foodSelected._id
        this.updateFood(food)

        this.setState(prev => ({
            isShowingAddFoodForm: false,
            isShowingDeleteConfirmation: false,
            isShowingEditFoodForm: false,
        }))
    }

    handleDeleteFood() {
        if (this.state.foodSelected == null) {
            return
        }
        const foodSelected = this.state.foodSelected
        const food = this.state.foods.find(x => x._id === foodSelected._id)
        this.deleteFood(food)
    }

    onFoodViewClicked(foodId, isSelected) {
        const foodSelected = this.state.foodSelected
        if (isSelected) {
            foodSelected.push(foodId)
        } else {
            const i = foodSelected.indexOf(foodId)
            foodSelected.splice(i, 1)
        }
        this.setState(prev => ({
            foodSelected: foodSelected
        }))
    }

    onFoodClicked(foodId, isSelected) {
        

        const selected = this.state.foodSelected
        if (selected && selected._id === foodId) {
          this.setState({
            foodSelected: null,
            isShowingAddFoodForm: false,
            isShowingEditFoodForm: false
          })
        }

        const newSelected = this.state.foods.find(food => food._id === foodId)
        this.setState({
          foodSelected: newSelected ? newSelected : null,
          isShowingAddFoodForm: false,
          isShowingEditFoodForm: false
        })
    } 

    onAddFoodFormEnable() {
        this.setState(prev => ({
            isShowingAddFoodForm: !prev.isShowingAddFoodForm,
            isShowingEditFoodForm: false,
            isShowingDeleteConfirmation: false,
        }))
    }

    getAddFoodForm() {
        return (
            <div className="container border border-primary">
                <h5 className="m-3">+ Thêm món ăn</h5>
                <Form className="m-2" onSubmit={(e) => { this.handleAddFood(e); this.onAddFoodFormEnable() }}>
                    <Form.Group className="mb-3" controlId="formFoodName">
                        <Form.Label>Tên món ăn</Form.Label>
                        <Form.Control 
                            required 
                            type="text" 
                            placeholder="Nhập tên món ăn" 
                            name="name"
                            onChange={e => this.handleInputChange('name', e)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.File id="formFoodImage" label="Hình ảnh món ăn" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formFoodDescription">
                        <Form.Label>Mô tả món ăn</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            rows={3} 
                            placeholder="Nhập mô tả món ăn" 
                            name="description"
                            onChange={e => this.handleInputChange('description', e)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formFoodPrice">
                        <Form.Label>Giá món ăn</Form.Label>
                        <Form.Control 
                            required
                            type="number"
                            step="0.01"
                            placeholder="Nhập giá món ăn" 
                            name="price"
                            onChange={e => this.handleInputChange('price', e)}
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Thêm món ăn
                    </Button>
                </Form>
            </div>
        )
    }

    onEditFoodFormOpened() {
        this.setState(prev => ({
            isShowingAddFoodForm: false,
            isShowingDeleteConfirmation: false,
            isShowingEditFoodForm: !prev.isShowingEditFoodForm
        }))
    }

    getEditFoodForm(food) {
        return (
            <div className="container border border-primary">
                <h5 className="m-3">Sửa món ăn</h5>
                <Form className="m-2">
                    <Form.Group 
                        className="mb-3" 
                        controlId="formUpdateFoodName"
                    >
                        <Form.Label>Tên món ăn</Form.Label>
                        <Form.Control 
                            required
                            type="text" 
                            placeholder="Nhập tên món ăn" 
                            defaultValue={food.name ? food.name : ''}
                            onChange={e => this.handleInputChange('name', e)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.File id="formUpdateFoodImage" label="Hình ảnh món ăn" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formUpdateFoodDescription">
                        <Form.Label>Mô tả món ăn</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            rows={3} 
                            placeholder="Nhập mô tả món ăn" 
                            defaultValue={ food.description ? food.description : '' }
                            onChange={e => this.handleInputChange('description', e)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formUpdateFoodPrice">
                        <Form.Label>Giá món ăn</Form.Label>
                        <Form.Control 
                            required
                            type="number"
                            step="0.01"
                            placeholder="Nhập giá món ăn" 
                            name="price"
                            onChange={e => this.handleInputChange('price', e)}
                            defaultValue={ food.price ? food.price : 0 }
                        />
                    </Form.Group>

                    <Button variant="primary" onClick={this.handleUpdateFood}>
                        Cập nhật
                    </Button>
                </Form>
            </div>
        )
    }

    onDeleteFoodConfirmation() {
        this.setState(prev => ({
            isShowingAddFoodForm: false,
            isShowingEditFoodForm: false,
            isShowingDeleteConfirmation: !prev.isShowingDeleteConfirmation,
        }))
    }

    getFoodDeleteConfirmationModal(food, show) {
        return (
            <Modal 
                show={show} 
                onHide={this.onDeleteFoodConfirmation} 
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header className="bg-danger text-white">
                <Modal.Title>Xác nhận xóa</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <b>Bạn chuẩn bị xóa món ăn sau:</b>
                    <hr/>
                    <p>ID: {food._id}</p>
                    <p>Tên: {food.name}</p>
                    <p>Giá: {food.price}</p>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={this.onDeleteFoodConfirmation}>
                    Đóng
                </Button>
                <Button variant="danger" onClick={() => { this.handleDeleteFood(); this.onDeleteFoodConfirmation() } }>
                    Xóa món ăn
                </Button>
                </Modal.Footer>
            </Modal>
        )
    }
}

function FoodList(props) {
    const foods = props.foods;
  
    if (foods.length > 0) {
        const selectedId = props.selectedFood ? props.selectedFood._id : undefined
        console.log("Sel: " + selectedId)
        const foodList = foods.map((value, index) => {
            return <FoodRow key={value._id} food={value} onFoodClicked={props.onFoodClicked} selected={value._id === selectedId}/>
        })
  
        return (
            <Table striped bordered hover size="sm" className="text-center shadow-lg">
            <thead>
                <tr>
                    <th>Chọn</th>
                    <th>ID</th>
                    <th>Tên</th>
                    <th>Giá</th>
                </tr>
            </thead>
            <tbody>{foodList}</tbody>
            </Table>
        )
    } else {
        return (
            <React.Fragment>
                <div>Có vẻ không có món nào cả!</div>
                <br />
            </React.Fragment>
        )
    }
}

class FoodRow extends Component {
    constructor(props) {
        super(props)
        this.handleClick = this.handleClick.bind(this)
    }

    state = {
        isSelected: false
    }

    render() {
        const food = this.props.food
        const id = food._id.substring(0, 4) + '...'
        const isSelected = this.props.selected
        const checkedColumn = isSelected ? '✓' : ''
        const checkedRow = isSelected ? 'bg-dark text-light' : 'bg-light text-dark'

        return (
            <tr className={checkedRow} key={food._id} onClick={() => this.handleClick()}>
                <td width="10%">{checkedColumn}</td>
                <td>{id}</td>
                <td>{food.name}</td>
                <td>{food.price}</td>
            </tr>
        )
    }

    handleClick() {
        this.props.onFoodClicked(this.props.food._id, this.state.isSelected)
    }
} 