import React from "react";
import { Animated, PanResponder, View, Text, Dimensions, Image } from "react-native";
import STYLES from "./styles";
import { CircleBlueGradient } from "./components/CircleBlueGradient";
import { debounce } from "debounce";
import { monthName } from "./util";

let { width } = Dimensions.get('window'), counter = 0;

export default class RingPicker extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            pan: new Animated.Value(0),
            XY_AXES_COORDINATES: {
                X: 0,
                Y: 0,
                PAGE_Y: 0,
                PAGE_X: 0
            },
            CURRENT_ICON_SHIFT: 0,
            xPositions: [],
            yPositions: [],
            dates: [],
            isKeyDate: [],
            keyValues: [11, 18, 22],
            months: [],
            headers: ['COMPLIMENTS ARE COMING YOUR WAY AND YOU ARE GOING TO EMBRACE THEM',
                'WHO ARE YOU GIVING YOUR POWER AWAY TO?',
                'KEEP GOING YOU ARE CLOSE TO IT'],

            texts: ['It is a key date for you today! It is time for you to stop sacrificing yourself at the altar of other people\'s needs',
                'The Virgin moon opposes Neptune and squares Jupiter early in the day if you are in the Western Hemisphere, only to end in an',
                'The moon enters Cancer today encouraging you to spend time with your inner circle of friends.'
            ],
            currentMonth: monthName(new Date().getMonth()),
            selected: 0
        };

        this.GIRTH_ANGLE = 120;

        this.STEP_LENGTH_TO_1_ANGLE = 0;

        this.DIRECTIONS = {
            CLOCKWISE: "CLOCKWISE",
            COUNTERCLOCKWISE: "COUNTERCLOCKWISE"
        };

        this.CIRCLE_SECTIONS = {
            TOP_LEFT: "TOP_LEFT",
            TOP_RIGHT: "TOP_RIGHT",
            BOTTOM_LEFT: "BOTTOM_LEFT",
            BOTTOM_RIGHT: "BOTTOM_RIGHT"
        };

        this.CURRENT_CIRCLE_SECTION = null;
        this.CURRENT_DIRECTION = null;
        this.CURRENT_VECTOR_DIFFERENCE_LENGTH = 0;

        this.PREVIOUS_POSITION = {
            X: 0,
            Y: 0
        };



        this._panResponder = PanResponder.create({
            onMoveShouldSetResponderCapture: () => true, //Tell iOS that we are allowing the movement
            onMoveShouldSetPanResponderCapture: () => true, // Same here, tell iOS that we allow dragging
            onPanResponderGrant: (e, gestureState) => {
                this.resetCurrentValues();
                this.setPreviousDifferenceLengths(0, 0);
                this.state.pan.setValue(this.state.pan._value);
            },
            onPanResponderMove: (e, gestureState) => {

                counter = (counter + 1) % 100;

                if (counter % 15 == 0) {
                    if (this.CURRENT_DIRECTION === this.DIRECTIONS.CLOCKWISE) {
                        this.setState({ selected: (this.state.selected + 1) % 28, currentMonth: this.state.months[(this.state.selected + 1) % 28] });
                    }
                }
                if (counter % 16 === 0) {
                    if (this.CURRENT_DIRECTION === this.DIRECTIONS.COUNTERCLOCKWISE) {
                        if (this.state.selected === 0) {
                            this.setState({ selected: 27, currentMonth: this.state.months[27] });
                        }
                        else {
                            this.setState({ selected: (this.state.selected - 1), currentMonth: this.state.months[(this.state.selected - 1)] });
                        }
                    }
                }

                this.defineCurrentSection(gestureState.moveX, gestureState.moveY);
                this.checkPreviousDifferenceLengths(gestureState.dx, gestureState.dy);

                this.state.pan.setValue(this.CURRENT_VECTOR_DIFFERENCE_LENGTH);

            },
        });
    }

    componentDidMount = () => {
        let xPositions = [];
        let yPositions = [];
        let anglesInDegrees = [];
        let angles = [];
        let dates = [];
        let months = [];
        let isKeyDate = [];

        const { keyValues } = this.state;

        //Divide the circle into 28 parts and store the angles
        for (let i = 0; i < 14; i++) {
            anglesInDegrees[i] = 90 - (i * 90 / 7);
            anglesInDegrees[27 - i] = 90 + ((i + 1) * 90 / 7);
        }

        /*
         Use sine and cosine of angles to 
         find the x and y cordinatesof points on the circle
        */

        for (let i = 0; i < 28; i++) {
            isKeyDate[i] = keyValues.includes(i) ? true : false;
            angles[i] = (3.14159 / 180) * anglesInDegrees[i]; //convert into radians
            xPositions[i] = 140 + 140 * Math.cos(angles[i]) + 7;
            yPositions[i] = 140 - 140 * Math.sin(angles[i]) + 7;
            if (i < 21) {
                dates[i] = new Date(Date.now() + i * 24 * 3600000).getDate();
                months[i] = monthName(new Date(Date.now() + i * 24 * 3600000).getMonth());
            }
            else {
                dates[i] = new Date(Date.now() - ((28 - i) * 24 * 3600000)).getDate();
                months[i] = monthName(new Date(Date.now() - ((28 - i) * 24 * 3600000)).getMonth());
            }
        }
        this.setState({ xPositions, yPositions, dates, months, isKeyDate });
    }

    rotateOnInputPixelDistanceMatchingRadianShift() {
        return [
            {
                transform: [
                    {
                        rotate: this.state.pan.interpolate({ inputRange: [-(this.GIRTH_ANGLE * this.STEP_LENGTH_TO_1_ANGLE), 0, this.GIRTH_ANGLE * this.STEP_LENGTH_TO_1_ANGLE], outputRange: [`-${this.GIRTH_ANGLE}deg`, "0deg", `${this.GIRTH_ANGLE}deg`] })
                    }
                ]
            }
        ]
    };


    defineAxesCoordinatesOnLayoutDisplacement = () => {
        this._wheelNavigator.measure((x, y, width, height, pageX, pageY) => {
            this.setState({
                ...this.state,
                XY_AXES_COORDINATES: {
                    X: pageX + (width / 2),
                    Y: pageY + (height / 2),
                    PAGE_Y: pageY,
                    PAGE_X: pageX
                }
            });
            this.STEP_LENGTH_TO_1_ANGLE = Math.PI;
        });
    };

    defineAxesCoordinatesOnLayoutChangeByStylesOrScreenRotation = () => {
        this.defineAxesCoordinatesOnLayoutDisplacement();
    };

    defineCurrentSection(x, y) {
        let yAxis = y < this.state.XY_AXES_COORDINATES.Y ? "TOP" : "BOTTOM";
        let xAxis = x < this.state.XY_AXES_COORDINATES.X ? "LEFT" : "RIGHT";
        this.CURRENT_CIRCLE_SECTION = this.CIRCLE_SECTIONS[`${yAxis}_${xAxis}`];
    }

    resetCurrentValues() {
        this.CURRENT_CIRCLE_SECTION = null;
        this.CURRENT_DIRECTION = null;
        this.PREVIOUS_POSITION.X = 0;
        this.PREVIOUS_POSITION.Y = 0;
    }

    setPreviousDifferenceLengths(x, y) {
        this.PREVIOUS_POSITION.X = x;
        this.PREVIOUS_POSITION.Y = y;
    }

    checkPreviousDifferenceLengths(x, y) {
        if (this.CURRENT_CIRCLE_SECTION === null) {
            return;
        }

        let differenceX = x - this.PREVIOUS_POSITION.X;
        let differenceY = y - this.PREVIOUS_POSITION.Y;

        let getCurrentDirectionForYForLeftHemisphere = (diffY) => {
            if (diffY < 0) {
                return this.DIRECTIONS.CLOCKWISE;
            }
            if (diffY > 0) {
                return this.DIRECTIONS.COUNTERCLOCKWISE;
            }
        };

        let getCurrentDirectionForXForTopHemisphere = (diffX) => {
            if (diffX < 0) {
                return this.DIRECTIONS.COUNTERCLOCKWISE;
            }
            if (diffX > 0) {
                return this.DIRECTIONS.CLOCKWISE;
            }
        };

        let getCurrentDirectionForYForRightHemisphere = (diffY) => {
            if (diffY < 0) {
                return this.DIRECTIONS.COUNTERCLOCKWISE;
            }
            if (diffY > 0) {
                return this.DIRECTIONS.CLOCKWISE;
            }
        };

        let getCurrentDirectionForXForBottomHemisphere = (diffX) => {
            if (diffX < 0) {
                return this.DIRECTIONS.CLOCKWISE;
            }
            if (diffX > 0) {
                return this.DIRECTIONS.COUNTERCLOCKWISE;
            }
        };

        function getCurrentDirectionForTopLeftQuadrant(diffX, diffY) {
            if (diffX === 0) {
                return getCurrentDirectionForYForLeftHemisphere(diffY);
            }
            return getCurrentDirectionForXForTopHemisphere(diffX);
        }

        function getCurrentDirectionForTopRightQuadrant(diffX, diffY) {
            if (diffX === 0) {
                return getCurrentDirectionForYForRightHemisphere(diffY);
            }
            return getCurrentDirectionForXForTopHemisphere(diffX);
        }

        function getCurrentDirectionForBottomLeftQuadrant(diffX, diffY) {
            if (diffX === 0) {
                return getCurrentDirectionForYForLeftHemisphere(diffY);
            }
            return getCurrentDirectionForXForBottomHemisphere(diffX);
        }

        function getCurrentDirectionForBottomRightQuadrant(diffX, diffY) {
            if (diffX === 0) {
                return getCurrentDirectionForYForRightHemisphere(diffY);
            }
            return getCurrentDirectionForXForBottomHemisphere(diffX);
        }

        switch (this.CURRENT_CIRCLE_SECTION) {
            case this.CIRCLE_SECTIONS.TOP_LEFT:
                this.CURRENT_DIRECTION = getCurrentDirectionForTopLeftQuadrant(differenceX, differenceY);
                break;
            case this.CIRCLE_SECTIONS.TOP_RIGHT:
                this.CURRENT_DIRECTION = getCurrentDirectionForTopRightQuadrant(differenceX, differenceY);
                break;
            case this.CIRCLE_SECTIONS.BOTTOM_LEFT:
                this.CURRENT_DIRECTION = getCurrentDirectionForBottomLeftQuadrant(differenceX, differenceY);
                break;
            case this.CIRCLE_SECTIONS.BOTTOM_RIGHT:
                this.CURRENT_DIRECTION = getCurrentDirectionForBottomRightQuadrant(differenceX, differenceY);
                break;
        }

        this.setAdditiveMovementLength(differenceX, differenceY);
        this.setPreviousDifferenceLengths(x, y);
    }

    setAdditiveMovementLength(x, y) {
        let absoluteHypotenuseLength = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));

        if (this.CURRENT_DIRECTION === this.DIRECTIONS.CLOCKWISE) {
            this.CURRENT_VECTOR_DIFFERENCE_LENGTH += absoluteHypotenuseLength;
        }

        if (this.CURRENT_DIRECTION === this.DIRECTIONS.COUNTERCLOCKWISE) {
            this.CURRENT_VECTOR_DIFFERENCE_LENGTH -= absoluteHypotenuseLength;
        }
    }

    render() {
        let { xPositions, yPositions, dates, isKeyDate, texts, headers, currentMonth, selected } = this.state;

        return (
            <>
                <View onLayout={debounce(this.defineAxesCoordinatesOnLayoutChangeByStylesOrScreenRotation, 100)}>
                    <View
                        style={[STYLES.wheel]}
                        ref={component => this._wheelNavigator = component}
                        onLayout={this.defineAxesCoordinatesOnLayoutDisplacement}>
                        <Animated.View
                            style={this.rotateOnInputPixelDistanceMatchingRadianShift()}
                            {...this._panResponder.panHandlers}>
                            <CircleBlueGradient />
                        </Animated.View>

                        {xPositions.map((val, i) => {
                            return (
                                <View
                                    style={[i === selected && STYLES.selectedBackground,
                                    isKeyDate[i] && { borderWidth: 1 },
                                    { top: yPositions[i], left: xPositions[i] },
                                    STYLES.wheelInterior]}
                                    key={i} >
                                    <Text
                                        style={[STYLES.textCenter,
                                        i === selected ? STYLES.selectedDate : STYLES.normalDate]}>
                                        {dates[i]}
                                    </Text>
                                </View>
                            )
                        })}
                        <Text style={STYLES.monthText}>
                            {currentMonth}
                        </Text>
                        <View style={[STYLES.moodRing,
                        isKeyDate[selected] ? STYLES.selectedBackground : STYLES.grayBackground]} />
                        <View style={STYLES.avatarContainer}>
                            <Image source={require('./images/travel.jpg')}
                                style={STYLES.avatar}
                            />
                        </View>
                    </View>
                </View>

                <View style={[STYLES.cardStyle,
                { width: width - 40 },
                isKeyDate[selected] ? STYLES.selectedBackground : STYLES.slateBackground]}>
                    <View style={[STYLES.cardCircle, { left: width / 2 - 44 }]}>
                        <View style={STYLES.cardInnerCircle}>
                        </View>
                    </View>
                    <Text style={STYLES.dateHeader}>{currentMonth + ' ' + dates[selected]}</Text>
                    <View style={STYLES.marginTop10}>
                        <Text style={STYLES.cardHeader}>{headers[selected % 3]}</Text>
                    </View>
                    <View style={STYLES.marginVertical10}>
                        <Text style={STYLES.cardText}>{texts[selected % 3]}</Text>
                    </View>
                </View>
            </>
        );
    }
}
