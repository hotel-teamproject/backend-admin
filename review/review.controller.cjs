const Review = require('./review.model.cjs');
const { successResponse, errorResponse } = require('../shared/utils/response.cjs');

// 리뷰 목록 조회
exports.getReviews = async (req, res) => {
    try {
        const { page = 1, limit = 20, search, rating, reported } = req.query;
        const query = {};

        // 검색 필터
        if (search) {
            query.$or = [
                { hotelName: { $regex: search, $options: 'i' } },
                { userName: { $regex: search, $options: 'i' } },
                { userEmail: { $regex: search, $options: 'i' } }
            ];
        }

        // 평점 필터
        if (rating) {
            query.rating = parseInt(rating);
        }

        // 신고 필터
        if (reported !== undefined && reported !== '') {
            query.reported = reported === 'true';
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const reviews = await Review.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        const total = await Review.countDocuments(query);
        const totalPages = Math.ceil(total / parseInt(limit));

        return res.json(successResponse('리뷰 목록 조회 성공', {
            reviews,
            totalPages,
            currentPage: parseInt(page),
            total
        }));
    } catch (error) {
        console.error('review.getReviews error', error);
        return res.status(500).json(errorResponse('리뷰 목록 조회 실패', error, 500));
    }
};

// 리뷰 상세 조회
exports.getReviewById = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id).lean();
        if (!review) {
            return res.status(404).json(errorResponse('리뷰를 찾을 수 없습니다', null, 404));
        }
        return res.json(successResponse('리뷰 조회 성공', review));
    } catch (error) {
        console.error('review.getReviewById error', error);
        return res.status(500).json(errorResponse('리뷰 조회 실패', error, 500));
    }
};

// 리뷰 삭제
exports.deleteReview = async (req, res) => {
    try {
        await Review.findByIdAndDelete(req.params.id);
        return res.json(successResponse('리뷰 삭제 성공', null));
    } catch (error) {
        console.error('review.deleteReview error', error);
        return res.status(500).json(errorResponse('리뷰 삭제 실패', error, 500));
    }
};

// 신고된 리뷰 목록 조회
exports.getReportedReviews = async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const reviews = await Review.find({ reported: true })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .lean();

        const total = await Review.countDocuments({ reported: true });
        const totalPages = Math.ceil(total / parseInt(limit));

        return res.json(successResponse('신고된 리뷰 목록 조회 성공', {
            reviews,
            totalPages,
            currentPage: parseInt(page),
            total
        }));
    } catch (error) {
        console.error('review.getReportedReviews error', error);
        return res.status(500).json(errorResponse('신고된 리뷰 목록 조회 실패', error, 500));
    }
};

// 리뷰 신고 처리
exports.handleReport = async (req, res) => {
    try {
        const { action } = req.body; // 'approve' or 'reject'
        const review = await Review.findByIdAndUpdate(
            req.params.id,
            { reported: action === 'reject' ? false : true },
            { new: true }
        );
        return res.json(successResponse('신고 처리 완료', review));
    } catch (error) {
        console.error('review.handleReport error', error);
        return res.status(500).json(errorResponse('신고 처리 실패', error, 500));
    }
};

