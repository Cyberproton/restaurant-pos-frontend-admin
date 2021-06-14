import React, { Component } from 'react'
import { Card, Button } from 'react-bootstrap'

export default class FoodView extends Component {
    state = {
        isSelected: false
    }

    handleClick = (e) => {
    }

    render() {
        const isSelected = this.state.isSelected
        const food = this.props.food
        const bgcolor = isSelected? 'success' : 'light'
        const textColor = isSelected ? 'light' : 'dark'
        const borderColor = isSelected ? 'success' : 'dark'

        return (
            <div onClick={this.handleClick} className="col-auto mb-4">
                <Card
                    className="text-justify"
                    style={{ height: "100%" }}
                    bg={bgcolor}
                    text={textColor}
                    border={borderColor}
                >
                    <Card.Header 
                        as="h5"
                        className="text-center"
                    >
                        {food.name}
                    </Card.Header>
                    <Card.Img
                        variant="top"
                        style={{
                            height: "30vw",
                            objectFit: "cover",
                            width: "100%",
                        }}
                        src={food.imageUrl}
                        onError={e => { e.target.onerror = null; e.target.src = process.env.PUBLIC_URL + '/image_not_found.png' } }
                    />
                    <Card.Body>
                        <Card.Text className="text-justify">{food.description ? food.description : 'Không có mô tả'}</Card.Text>
                        <Card.Text className="text-center">
                        Price: <b>${food.price}</b>
                        </Card.Text>
                    </Card.Body>
                </Card>
            </div>
        )
    }
}