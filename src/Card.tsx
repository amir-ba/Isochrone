
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import './Card.css';
import { Divider, List, ListItem, ListItemText, ListSubheader, Slider, Tooltip, Typography } from '@material-ui/core';
import { ChangeEvent, createRef, ReactElement, useContext, useRef } from 'react';
import { DistanceContext } from './DistanceContext';
import { AddressContext } from './AddressContext';
import { Address } from './models/nominations_interfaces';

interface Props {
  children: ReactElement;
  open: boolean;
  value: number;
  }

  const ValueLabelComponent = (props: Props) =>{
  const { children, open, value } = props;

  return (
      <Tooltip  open={open} enterTouchDelay={0} placement="top" title={value}>
      {children}
      </Tooltip>
  );
  };
const createListFromAddress = (address: Address) =>
   <List className={'list-root'} >
    {Object.keys(address)
    .filter(sectionId => sectionId !== 'country_code')
    .map(sectionId => (
          <ListItem key={`item-${sectionId}`} className={'ul-el'}>
              <ListItemText   className={'li-element'} secondary={`${address[sectionId as keyof Address]}`}  primary={sectionId}/>
          </ListItem>
    ))}
  </List>;

export default function ConfigCard() {
    const {distance, setDistance} = useContext(DistanceContext);
    const {address} = useContext(AddressContext);
    const addressRef = useRef({} as Address);
    addressRef.current = address;
    const handleChange = (event: ChangeEvent<{}>, newValue: number | Array<number>) => {
        setDistance(newValue as number);
    };
    const textList = createListFromAddress(addressRef.current);
    return (
      <Card className='root' variant="outlined">
        <CardContent>
          <Typography className='title' color="textSecondary" gutterBottom>
            set the Isochrone distance in Km
          </Typography>
          <Slider
              value={distance}
              ValueLabelComponent={ValueLabelComponent}
              onChange={handleChange}
              min={0}
              max={110}
              aria-label="custom thumb label" />
               <Divider />
          { textList }
        </CardContent>

      </Card>
    );
}