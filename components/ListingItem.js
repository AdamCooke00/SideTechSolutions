import Link from 'next/link';
import React from 'react';
import { Button, Image, Item, Label} from "semantic-ui-react";
function ListingItem({address, id, price, bedrooms}) {

    return (
            <Item>
                <Item.Image src="https://picsum.photos/200"/>
                <Item.Content>
                    <Item.Header>{address}</Item.Header>
                    <Item.Meta>
                        <span className='cinema'>Property Company</span>
                    </Item.Meta>
                    <Item.Description>Bedrooms: {bedrooms} Price: ${price} or ${parseInt(price/bedrooms)}/person</Item.Description>
                    <Item.Extra>
                        <Link href={`/listings/${id}`}>
                            <Button primary floated='right'>More Info</Button>
                        </Link>
                        <Label>Sponsored</Label>
                    </Item.Extra>
                </Item.Content>
            </Item>
    );
}

export default ListingItem;