export default {
    isClose: function (a, b, tolerance = 0.0000000001) {
        return Math.abs(a - b) < tolerance;
    }
}