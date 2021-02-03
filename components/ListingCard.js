import Link from 'next/link';
import React from 'react';
import {Card, Button} from "react-bootstrap"
function ListingCard({address, id, price, bedrooms}) {

    return (
            <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src="https://picsum.photos/200" />
                <Card.Body>
                    <Card.Title>{address}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">Bedrooms: {bedrooms}</Card.Subtitle>
                    <Card.Subtitle className="mb-2 text-muted">Price: ${price} or ${parseInt(price/bedrooms)}/person</Card.Subtitle>
                    <Link href={`/listings/${id}`}>
                        <Button variant="primary">More Info</Button>
                    </Link>
                </Card.Body>
            </Card>
    );
}

export default ListingCard;