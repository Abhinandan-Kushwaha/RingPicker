import { StyleSheet } from "react-native";

export default StyleSheet.create({
    appContainer: {
        flex: 1,
        marginTop: 100,
        alignItems: 'center'
    },
    wheel: {
        width: 320,
        height: 320
    },
    wheelInterior: {
        position: 'absolute',
        height: 30,
        width: 30,
        borderRadius: 15, justifyContent: 'center', alignItems: 'center'
    },
    textCenter: {
        textAlign: 'center',
    },
    selectedDate: {
        fontWeight: 'bold',
        fontSize: 14,
        color: 'white'
    },
    normalDate: {
        color: '#4a6a83',
        fontSize: 12
    },
    selectedBackground: { backgroundColor: '#8EAEC7' },
    grayBackground: { backgroundColor: 'gray' },
    slateBackground: { backgroundColor: '#5B6775' },
    monthText: {
        position: 'absolute',
        top: 60,
        left: 145,
        color: '#8EAEC7',
        fontSize: 18
    },
    moodRing: {
        position: 'absolute',
        top: 85,
        left: 85,
        width: 150,
        height: 150,
        borderRadius: 75
    },
    avatarContainer: {
        position: 'absolute',
        top: 100,
        left: 100,
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white'
    },
    avatar: {
        width: 114,
        height: 114,
        borderRadius: 57
    },
    cardStyle: {
        marginTop: 40,
        padding: 20,
        borderRadius: 10,
        alignItems: 'center'
    },
    cardCircle: {
        position: 'absolute',
        top: -24,
        height: 48,
        width: 48,
        backgroundColor: '#eecdcd',
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center'
    },
    cardInnerCircle: {
        position: 'absolute',
        height: 44,
        width: 44,
        backgroundColor: '#E98A87',
        borderRadius: 22
    },
    dateHeader: {
        marginTop: 20,
        color: 'white',
        fontSize: 24
    },
    cardHeader: {
        textAlign: 'center',
        color: '#ededed',
        fontSize: 16
    },
    cardText: {
        textAlign: 'center',
        color: 'white',
        fontSize: 14
    },
    marginTop10: { marginTop: 10 },
    marginVertical10: { marginVertical: 10 }
});