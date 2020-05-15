mockRequest = (sessionData, body) => ({
    session: {
        data: sessionData
    },
    body: body,
});

mockResponse = () => {
    const res = {};
    res.s = jest.fn()
    res.j = jest.fn()

    res.status = (status) => {
        if (status === undefined) {
            return res.s();
        } else {
            res.s.mockReturnValue(status);
            return res;
        }
    }

    res.json = (data) => {
        if (data === undefined) {
            return res.j();
        } else {
            res.j.mockReturnValue(data);
            return res;
        }
    }

    return res;
};

module.exports = {
    mockRequest,
    mockResponse
}