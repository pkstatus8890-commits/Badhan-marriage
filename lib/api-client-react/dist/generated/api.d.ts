import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { AdminActionInput, AdminActionResponse, AdminDashboard, AdminData, AdminLoginInput, AdminSession, BlockInput, CommunityOption, CommunitySuggestionInput, CourseSummary, HealthStatus, InterestInput, ListPublicCommunitiesParams, LogoutResult, LooseRecord, MemberSession, MessageInput, MyProfile, OtpRequestResult, OtpVerificationInput, PhoneInput, PhotoUploadUrlInput, PhotoUploadUrlResponse, ProfileInput, ProfilePhotoInput, PublicPlan, PublicProfile, ReportInput, RequestLists, RequestResponseInput, SearchMemberProfilesParams } from './api.schemas';
import { customFetch } from '../custom-fetch';
import type { ErrorType, BodyType } from '../custom-fetch';
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
export declare const getHealthCheckUrl: () => string;
/**
 * Returns server health status
 * @summary Health check
 */
export declare const healthCheck: (options?: Parameters<typeof customFetch>[1]) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getRequestMemberOtpUrl: () => string;
/**
 * @summary Send a real phone verification code
 */
export declare const requestMemberOtp: (phoneInput: PhoneInput, options?: Parameters<typeof customFetch>[1]) => Promise<OtpRequestResult>;
export declare const getRequestMemberOtpMutationKey: () => readonly ["requestMemberOtp"];
export declare const getRequestMemberOtpMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof requestMemberOtp>>, TError, RequestMemberOtpMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof requestMemberOtp>>, TError, RequestMemberOtpMutationVariables, TContext>;
export type RequestMemberOtpMutationResult = NonNullable<Awaited<ReturnType<typeof requestMemberOtp>>>;
export type RequestMemberOtpMutationBody = BodyType<PhoneInput>;
export type RequestMemberOtpMutationError = ErrorType<void>;
export type RequestMemberOtpMutationVariables = {
    data: BodyType<PhoneInput>;
};
/**
* @summary Send a real phone verification code
*/
export declare const useRequestMemberOtp: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof requestMemberOtp>>, TError, RequestMemberOtpMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof requestMemberOtp>>, TError, RequestMemberOtpMutationVariables, TContext>;
export declare const getVerifyMemberOtpUrl: () => string;
/**
 * @summary Verify a phone code and create a member session
 */
export declare const verifyMemberOtp: (otpVerificationInput: OtpVerificationInput, options?: Parameters<typeof customFetch>[1]) => Promise<MemberSession>;
export declare const getVerifyMemberOtpMutationKey: () => readonly ["verifyMemberOtp"];
export declare const getVerifyMemberOtpMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof verifyMemberOtp>>, TError, VerifyMemberOtpMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof verifyMemberOtp>>, TError, VerifyMemberOtpMutationVariables, TContext>;
export type VerifyMemberOtpMutationResult = NonNullable<Awaited<ReturnType<typeof verifyMemberOtp>>>;
export type VerifyMemberOtpMutationBody = BodyType<OtpVerificationInput>;
export type VerifyMemberOtpMutationError = ErrorType<void>;
export type VerifyMemberOtpMutationVariables = {
    data: BodyType<OtpVerificationInput>;
};
/**
* @summary Verify a phone code and create a member session
*/
export declare const useVerifyMemberOtp: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof verifyMemberOtp>>, TError, VerifyMemberOtpMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof verifyMemberOtp>>, TError, VerifyMemberOtpMutationVariables, TContext>;
export declare const getGetMemberSessionUrl: () => string;
/**
 * @summary Return the signed-in member identity
 */
export declare const getMemberSession: (options?: Parameters<typeof customFetch>[1]) => Promise<MemberSession>;
export declare const getGetMemberSessionQueryKey: () => readonly ["/api/auth/session"];
export declare const getGetMemberSessionQueryOptions: <TData = Awaited<ReturnType<typeof getMemberSession>>, TError = ErrorType<void>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMemberSession>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getMemberSession>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetMemberSessionQueryResult = NonNullable<Awaited<ReturnType<typeof getMemberSession>>>;
export type GetMemberSessionQueryError = ErrorType<void>;
/**
 * @summary Return the signed-in member identity
 */
export declare function useGetMemberSession<TData = Awaited<ReturnType<typeof getMemberSession>>, TError = ErrorType<void>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMemberSession>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getLogoutMemberUrl: () => string;
/**
 * @summary Revoke the signed-in member session
 */
export declare const logoutMember: (options?: Parameters<typeof customFetch>[1]) => Promise<LogoutResult>;
export declare const getLogoutMemberMutationKey: () => readonly ["logoutMember"];
export declare const getLogoutMemberMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof logoutMember>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof logoutMember>>, TError, void, TContext>;
export type LogoutMemberMutationResult = NonNullable<Awaited<ReturnType<typeof logoutMember>>>;
export type LogoutMemberMutationError = ErrorType<unknown>;
/**
* @summary Revoke the signed-in member session
*/
export declare const useLogoutMember: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof logoutMember>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof logoutMember>>, TError, void, TContext>;
export declare const getSearchMemberProfilesUrl: (params?: SearchMemberProfilesParams) => string;
/**
 * @summary Search approved profiles using member-selected filters
 */
export declare const searchMemberProfiles: (params?: SearchMemberProfilesParams, options?: Parameters<typeof customFetch>[1]) => Promise<PublicProfile[]>;
export declare const getSearchMemberProfilesQueryKey: (params?: SearchMemberProfilesParams) => readonly ["/api/profiles", ...SearchMemberProfilesParams[]];
export declare const getSearchMemberProfilesQueryOptions: <TData = Awaited<ReturnType<typeof searchMemberProfiles>>, TError = ErrorType<void>>(params?: SearchMemberProfilesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof searchMemberProfiles>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof searchMemberProfiles>>, TError, TData> & {
    queryKey: QueryKey;
};
export type SearchMemberProfilesQueryResult = NonNullable<Awaited<ReturnType<typeof searchMemberProfiles>>>;
export type SearchMemberProfilesQueryError = ErrorType<void>;
/**
 * @summary Search approved profiles using member-selected filters
 */
export declare function useSearchMemberProfiles<TData = Awaited<ReturnType<typeof searchMemberProfiles>>, TError = ErrorType<void>>(params?: SearchMemberProfilesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof searchMemberProfiles>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetMemberProfileUrl: (profileId: string) => string;
/**
 * @summary View an approved member profile without private contact details
 */
export declare const getMemberProfile: (profileId: string, options?: Parameters<typeof customFetch>[1]) => Promise<PublicProfile>;
export declare const getGetMemberProfileQueryKey: (profileId: string) => readonly [`/api/profiles/${string}`];
export declare const getGetMemberProfileQueryOptions: <TData = Awaited<ReturnType<typeof getMemberProfile>>, TError = ErrorType<void>>(profileId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMemberProfile>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getMemberProfile>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetMemberProfileQueryResult = NonNullable<Awaited<ReturnType<typeof getMemberProfile>>>;
export type GetMemberProfileQueryError = ErrorType<void>;
/**
 * @summary View an approved member profile without private contact details
 */
export declare function useGetMemberProfile<TData = Awaited<ReturnType<typeof getMemberProfile>>, TError = ErrorType<void>>(profileId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMemberProfile>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetMyMarriageProfileUrl: () => string;
/**
 * @summary Load the member's private marriage profile
 */
export declare const getMyMarriageProfile: (options?: Parameters<typeof customFetch>[1]) => Promise<MyProfile>;
export declare const getGetMyMarriageProfileQueryKey: () => readonly ["/api/me/profile"];
export declare const getGetMyMarriageProfileQueryOptions: <TData = Awaited<ReturnType<typeof getMyMarriageProfile>>, TError = ErrorType<void>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMyMarriageProfile>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getMyMarriageProfile>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetMyMarriageProfileQueryResult = NonNullable<Awaited<ReturnType<typeof getMyMarriageProfile>>>;
export type GetMyMarriageProfileQueryError = ErrorType<void>;
/**
 * @summary Load the member's private marriage profile
 */
export declare function useGetMyMarriageProfile<TData = Awaited<ReturnType<typeof getMyMarriageProfile>>, TError = ErrorType<void>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getMyMarriageProfile>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getAttachMyProfilePhotoUrl: () => string;
/**
 * @summary Attach an uploaded image to the signed-in member profile
 */
export declare const attachMyProfilePhoto: (profilePhotoInput: ProfilePhotoInput, options?: Parameters<typeof customFetch>[1]) => Promise<LooseRecord>;
export declare const getAttachMyProfilePhotoMutationKey: () => readonly ["attachMyProfilePhoto"];
export declare const getAttachMyProfilePhotoMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof attachMyProfilePhoto>>, TError, AttachMyProfilePhotoMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof attachMyProfilePhoto>>, TError, AttachMyProfilePhotoMutationVariables, TContext>;
export type AttachMyProfilePhotoMutationResult = NonNullable<Awaited<ReturnType<typeof attachMyProfilePhoto>>>;
export type AttachMyProfilePhotoMutationBody = BodyType<ProfilePhotoInput>;
export type AttachMyProfilePhotoMutationError = ErrorType<void>;
export type AttachMyProfilePhotoMutationVariables = {
    data: BodyType<ProfilePhotoInput>;
};
/**
* @summary Attach an uploaded image to the signed-in member profile
*/
export declare const useAttachMyProfilePhoto: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof attachMyProfilePhoto>>, TError, AttachMyProfilePhotoMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof attachMyProfilePhoto>>, TError, AttachMyProfilePhotoMutationVariables, TContext>;
export declare const getDeleteMyProfilePhotoUrl: (photoId: string) => string;
/**
 * @summary Delete a photo from the signed-in member profile
 */
export declare const deleteMyProfilePhoto: (photoId: string, options?: Parameters<typeof customFetch>[1]) => Promise<LogoutResult>;
export declare const getDeleteMyProfilePhotoMutationKey: () => readonly ["deleteMyProfilePhoto"];
export declare const getDeleteMyProfilePhotoMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteMyProfilePhoto>>, TError, DeleteMyProfilePhotoMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteMyProfilePhoto>>, TError, DeleteMyProfilePhotoMutationVariables, TContext>;
export type DeleteMyProfilePhotoMutationResult = NonNullable<Awaited<ReturnType<typeof deleteMyProfilePhoto>>>;
export type DeleteMyProfilePhotoMutationError = ErrorType<void>;
export type DeleteMyProfilePhotoMutationVariables = {
    photoId: string;
};
/**
* @summary Delete a photo from the signed-in member profile
*/
export declare const useDeleteMyProfilePhoto: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteMyProfilePhoto>>, TError, DeleteMyProfilePhotoMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteMyProfilePhoto>>, TError, DeleteMyProfilePhotoMutationVariables, TContext>;
export declare const getRequestProfilePhotoUploadUrlUrl: () => string;
/**
 * @summary Request a short-lived upload URL for a profile photo
 */
export declare const requestProfilePhotoUploadUrl: (photoUploadUrlInput: PhotoUploadUrlInput, options?: Parameters<typeof customFetch>[1]) => Promise<PhotoUploadUrlResponse>;
export declare const getRequestProfilePhotoUploadUrlMutationKey: () => readonly ["requestProfilePhotoUploadUrl"];
export declare const getRequestProfilePhotoUploadUrlMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof requestProfilePhotoUploadUrl>>, TError, RequestProfilePhotoUploadUrlMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof requestProfilePhotoUploadUrl>>, TError, RequestProfilePhotoUploadUrlMutationVariables, TContext>;
export type RequestProfilePhotoUploadUrlMutationResult = NonNullable<Awaited<ReturnType<typeof requestProfilePhotoUploadUrl>>>;
export type RequestProfilePhotoUploadUrlMutationBody = BodyType<PhotoUploadUrlInput>;
export type RequestProfilePhotoUploadUrlMutationError = ErrorType<void>;
export type RequestProfilePhotoUploadUrlMutationVariables = {
    data: BodyType<PhotoUploadUrlInput>;
};
/**
* @summary Request a short-lived upload URL for a profile photo
*/
export declare const useRequestProfilePhotoUploadUrl: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof requestProfilePhotoUploadUrl>>, TError, RequestProfilePhotoUploadUrlMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof requestProfilePhotoUploadUrl>>, TError, RequestProfilePhotoUploadUrlMutationVariables, TContext>;
export declare const getSaveMyMarriageProfileUrl: () => string;
/**
 * @summary Create or update the signed-in member's marriage profile
 */
export declare const saveMyMarriageProfile: (profileInput: ProfileInput, options?: Parameters<typeof customFetch>[1]) => Promise<MyProfile>;
export declare const getSaveMyMarriageProfileMutationKey: () => readonly ["saveMyMarriageProfile"];
export declare const getSaveMyMarriageProfileMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof saveMyMarriageProfile>>, TError, SaveMyMarriageProfileMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof saveMyMarriageProfile>>, TError, SaveMyMarriageProfileMutationVariables, TContext>;
export type SaveMyMarriageProfileMutationResult = NonNullable<Awaited<ReturnType<typeof saveMyMarriageProfile>>>;
export type SaveMyMarriageProfileMutationBody = BodyType<ProfileInput>;
export type SaveMyMarriageProfileMutationError = ErrorType<void>;
export type SaveMyMarriageProfileMutationVariables = {
    data: BodyType<ProfileInput>;
};
/**
* @summary Create or update the signed-in member's marriage profile
*/
export declare const useSaveMyMarriageProfile: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof saveMyMarriageProfile>>, TError, SaveMyMarriageProfileMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof saveMyMarriageProfile>>, TError, SaveMyMarriageProfileMutationVariables, TContext>;
export declare const getListMemberRequestsUrl: () => string;
/**
 * @summary List sent and received connection interests
 */
export declare const listMemberRequests: (options?: Parameters<typeof customFetch>[1]) => Promise<RequestLists>;
export declare const getListMemberRequestsQueryKey: () => readonly ["/api/requests"];
export declare const getListMemberRequestsQueryOptions: <TData = Awaited<ReturnType<typeof listMemberRequests>>, TError = ErrorType<void>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listMemberRequests>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listMemberRequests>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListMemberRequestsQueryResult = NonNullable<Awaited<ReturnType<typeof listMemberRequests>>>;
export type ListMemberRequestsQueryError = ErrorType<void>;
/**
 * @summary List sent and received connection interests
 */
export declare function useListMemberRequests<TData = Awaited<ReturnType<typeof listMemberRequests>>, TError = ErrorType<void>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listMemberRequests>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getSendMemberInterestUrl: () => string;
/**
 * @summary Send an interest request to an approved profile
 */
export declare const sendMemberInterest: (interestInput: InterestInput, options?: Parameters<typeof customFetch>[1]) => Promise<LooseRecord>;
export declare const getSendMemberInterestMutationKey: () => readonly ["sendMemberInterest"];
export declare const getSendMemberInterestMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof sendMemberInterest>>, TError, SendMemberInterestMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof sendMemberInterest>>, TError, SendMemberInterestMutationVariables, TContext>;
export type SendMemberInterestMutationResult = NonNullable<Awaited<ReturnType<typeof sendMemberInterest>>>;
export type SendMemberInterestMutationBody = BodyType<InterestInput>;
export type SendMemberInterestMutationError = ErrorType<void>;
export type SendMemberInterestMutationVariables = {
    data: BodyType<InterestInput>;
};
/**
* @summary Send an interest request to an approved profile
*/
export declare const useSendMemberInterest: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof sendMemberInterest>>, TError, SendMemberInterestMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof sendMemberInterest>>, TError, SendMemberInterestMutationVariables, TContext>;
export declare const getRespondToMemberInterestUrl: (requestId: string) => string;
/**
 * @summary Accept or decline a received interest request
 */
export declare const respondToMemberInterest: (requestId: string, requestResponseInput: RequestResponseInput, options?: Parameters<typeof customFetch>[1]) => Promise<LooseRecord>;
export declare const getRespondToMemberInterestMutationKey: () => readonly ["respondToMemberInterest"];
export declare const getRespondToMemberInterestMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof respondToMemberInterest>>, TError, RespondToMemberInterestMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof respondToMemberInterest>>, TError, RespondToMemberInterestMutationVariables, TContext>;
export type RespondToMemberInterestMutationResult = NonNullable<Awaited<ReturnType<typeof respondToMemberInterest>>>;
export type RespondToMemberInterestMutationBody = BodyType<RequestResponseInput>;
export type RespondToMemberInterestMutationError = ErrorType<void>;
export type RespondToMemberInterestMutationVariables = {
    requestId: string;
    data: BodyType<RequestResponseInput>;
};
/**
* @summary Accept or decline a received interest request
*/
export declare const useRespondToMemberInterest: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof respondToMemberInterest>>, TError, RespondToMemberInterestMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof respondToMemberInterest>>, TError, RespondToMemberInterestMutationVariables, TContext>;
export declare const getListMemberConversationsUrl: () => string;
/**
 * @summary List accepted conversations for the signed-in member
 */
export declare const listMemberConversations: (options?: Parameters<typeof customFetch>[1]) => Promise<LooseRecord[]>;
export declare const getListMemberConversationsQueryKey: () => readonly ["/api/conversations"];
export declare const getListMemberConversationsQueryOptions: <TData = Awaited<ReturnType<typeof listMemberConversations>>, TError = ErrorType<void>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listMemberConversations>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listMemberConversations>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListMemberConversationsQueryResult = NonNullable<Awaited<ReturnType<typeof listMemberConversations>>>;
export type ListMemberConversationsQueryError = ErrorType<void>;
/**
 * @summary List accepted conversations for the signed-in member
 */
export declare function useListMemberConversations<TData = Awaited<ReturnType<typeof listMemberConversations>>, TError = ErrorType<void>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listMemberConversations>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListConversationMessagesUrl: (conversationId: string) => string;
/**
 * @summary Load messages for a participant in an active conversation
 */
export declare const listConversationMessages: (conversationId: string, options?: Parameters<typeof customFetch>[1]) => Promise<LooseRecord[]>;
export declare const getListConversationMessagesQueryKey: (conversationId: string) => readonly [`/api/conversations/${string}/messages`];
export declare const getListConversationMessagesQueryOptions: <TData = Awaited<ReturnType<typeof listConversationMessages>>, TError = ErrorType<void>>(conversationId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listConversationMessages>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listConversationMessages>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListConversationMessagesQueryResult = NonNullable<Awaited<ReturnType<typeof listConversationMessages>>>;
export type ListConversationMessagesQueryError = ErrorType<void>;
/**
 * @summary Load messages for a participant in an active conversation
 */
export declare function useListConversationMessages<TData = Awaited<ReturnType<typeof listConversationMessages>>, TError = ErrorType<void>>(conversationId: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listConversationMessages>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getSendConversationMessageUrl: (conversationId: string) => string;
/**
 * @summary Send a message subject to the member's current plan limit
 */
export declare const sendConversationMessage: (conversationId: string, messageInput: MessageInput, options?: Parameters<typeof customFetch>[1]) => Promise<LooseRecord>;
export declare const getSendConversationMessageMutationKey: () => readonly ["sendConversationMessage"];
export declare const getSendConversationMessageMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof sendConversationMessage>>, TError, SendConversationMessageMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof sendConversationMessage>>, TError, SendConversationMessageMutationVariables, TContext>;
export type SendConversationMessageMutationResult = NonNullable<Awaited<ReturnType<typeof sendConversationMessage>>>;
export type SendConversationMessageMutationBody = BodyType<MessageInput>;
export type SendConversationMessageMutationError = ErrorType<void>;
export type SendConversationMessageMutationVariables = {
    conversationId: string;
    data: BodyType<MessageInput>;
};
/**
* @summary Send a message subject to the member's current plan limit
*/
export declare const useSendConversationMessage: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof sendConversationMessage>>, TError, SendConversationMessageMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof sendConversationMessage>>, TError, SendConversationMessageMutationVariables, TContext>;
export declare const getReportMemberUrl: () => string;
/**
 * @summary Report a member for safety review
 */
export declare const reportMember: (reportInput: ReportInput, options?: Parameters<typeof customFetch>[1]) => Promise<LooseRecord>;
export declare const getReportMemberMutationKey: () => readonly ["reportMember"];
export declare const getReportMemberMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof reportMember>>, TError, ReportMemberMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof reportMember>>, TError, ReportMemberMutationVariables, TContext>;
export type ReportMemberMutationResult = NonNullable<Awaited<ReturnType<typeof reportMember>>>;
export type ReportMemberMutationBody = BodyType<ReportInput>;
export type ReportMemberMutationError = ErrorType<void>;
export type ReportMemberMutationVariables = {
    data: BodyType<ReportInput>;
};
/**
* @summary Report a member for safety review
*/
export declare const useReportMember: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof reportMember>>, TError, ReportMemberMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof reportMember>>, TError, ReportMemberMutationVariables, TContext>;
export declare const getBlockMemberUrl: () => string;
/**
 * @summary Block a member from contacting the signed-in member
 */
export declare const blockMember: (blockInput: BlockInput, options?: Parameters<typeof customFetch>[1]) => Promise<LogoutResult>;
export declare const getBlockMemberMutationKey: () => readonly ["blockMember"];
export declare const getBlockMemberMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof blockMember>>, TError, BlockMemberMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof blockMember>>, TError, BlockMemberMutationVariables, TContext>;
export type BlockMemberMutationResult = NonNullable<Awaited<ReturnType<typeof blockMember>>>;
export type BlockMemberMutationBody = BodyType<BlockInput>;
export type BlockMemberMutationError = ErrorType<void>;
export type BlockMemberMutationVariables = {
    data: BodyType<BlockInput>;
};
/**
* @summary Block a member from contacting the signed-in member
*/
export declare const useBlockMember: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof blockMember>>, TError, BlockMemberMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof blockMember>>, TError, BlockMemberMutationVariables, TContext>;
export declare const getSuggestCommunityUrl: () => string;
/**
 * @summary Add a self-selected community label to the searchable catalog
 */
export declare const suggestCommunity: (communitySuggestionInput: CommunitySuggestionInput, options?: Parameters<typeof customFetch>[1]) => Promise<CommunityOption>;
export declare const getSuggestCommunityMutationKey: () => readonly ["suggestCommunity"];
export declare const getSuggestCommunityMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof suggestCommunity>>, TError, SuggestCommunityMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof suggestCommunity>>, TError, SuggestCommunityMutationVariables, TContext>;
export type SuggestCommunityMutationResult = NonNullable<Awaited<ReturnType<typeof suggestCommunity>>>;
export type SuggestCommunityMutationBody = BodyType<CommunitySuggestionInput>;
export type SuggestCommunityMutationError = ErrorType<void>;
export type SuggestCommunityMutationVariables = {
    data: BodyType<CommunitySuggestionInput>;
};
/**
* @summary Add a self-selected community label to the searchable catalog
*/
export declare const useSuggestCommunity: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof suggestCommunity>>, TError, SuggestCommunityMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof suggestCommunity>>, TError, SuggestCommunityMutationVariables, TContext>;
export declare const getAdminLoginUrl: () => string;
/**
 * @summary Start a separate administrator session
 */
export declare const adminLogin: (adminLoginInput: AdminLoginInput, options?: Parameters<typeof customFetch>[1]) => Promise<AdminSession>;
export declare const getAdminLoginMutationKey: () => readonly ["adminLogin"];
export declare const getAdminLoginMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminLogin>>, TError, AdminLoginMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof adminLogin>>, TError, AdminLoginMutationVariables, TContext>;
export type AdminLoginMutationResult = NonNullable<Awaited<ReturnType<typeof adminLogin>>>;
export type AdminLoginMutationBody = BodyType<AdminLoginInput>;
export type AdminLoginMutationError = ErrorType<void>;
export type AdminLoginMutationVariables = {
    data: BodyType<AdminLoginInput>;
};
/**
* @summary Start a separate administrator session
*/
export declare const useAdminLogin: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminLogin>>, TError, AdminLoginMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof adminLogin>>, TError, AdminLoginMutationVariables, TContext>;
export declare const getGetAdminSessionUrl: () => string;
/**
 * @summary Check the administrator session
 */
export declare const getAdminSession: (options?: Parameters<typeof customFetch>[1]) => Promise<AdminSession>;
export declare const getGetAdminSessionQueryKey: () => readonly ["/api/admin/session"];
export declare const getGetAdminSessionQueryOptions: <TData = Awaited<ReturnType<typeof getAdminSession>>, TError = ErrorType<void>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAdminSession>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getAdminSession>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetAdminSessionQueryResult = NonNullable<Awaited<ReturnType<typeof getAdminSession>>>;
export type GetAdminSessionQueryError = ErrorType<void>;
/**
 * @summary Check the administrator session
 */
export declare function useGetAdminSession<TData = Awaited<ReturnType<typeof getAdminSession>>, TError = ErrorType<void>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAdminSession>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getAdminLogoutUrl: () => string;
/**
 * @summary Revoke the current administrator session
 */
export declare const adminLogout: (options?: Parameters<typeof customFetch>[1]) => Promise<LogoutResult>;
export declare const getAdminLogoutMutationKey: () => readonly ["adminLogout"];
export declare const getAdminLogoutMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminLogout>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof adminLogout>>, TError, void, TContext>;
export type AdminLogoutMutationResult = NonNullable<Awaited<ReturnType<typeof adminLogout>>>;
export type AdminLogoutMutationError = ErrorType<unknown>;
/**
* @summary Revoke the current administrator session
*/
export declare const useAdminLogout: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminLogout>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof adminLogout>>, TError, void, TContext>;
export declare const getGetAdminDashboardUrl: () => string;
/**
 * @summary Load database-backed dashboard statistics
 */
export declare const getAdminDashboard: (options?: Parameters<typeof customFetch>[1]) => Promise<AdminDashboard>;
export declare const getGetAdminDashboardQueryKey: () => readonly ["/api/admin/dashboard"];
export declare const getGetAdminDashboardQueryOptions: <TData = Awaited<ReturnType<typeof getAdminDashboard>>, TError = ErrorType<void>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAdminDashboard>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getAdminDashboard>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetAdminDashboardQueryResult = NonNullable<Awaited<ReturnType<typeof getAdminDashboard>>>;
export type GetAdminDashboardQueryError = ErrorType<void>;
/**
 * @summary Load database-backed dashboard statistics
 */
export declare function useGetAdminDashboard<TData = Awaited<ReturnType<typeof getAdminDashboard>>, TError = ErrorType<void>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAdminDashboard>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getGetAdminDataUrl: () => string;
/**
 * @summary Load management records for the administrator console
 */
export declare const getAdminData: (options?: Parameters<typeof customFetch>[1]) => Promise<AdminData>;
export declare const getGetAdminDataQueryKey: () => readonly ["/api/admin/data"];
export declare const getGetAdminDataQueryOptions: <TData = Awaited<ReturnType<typeof getAdminData>>, TError = ErrorType<void>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAdminData>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getAdminData>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetAdminDataQueryResult = NonNullable<Awaited<ReturnType<typeof getAdminData>>>;
export type GetAdminDataQueryError = ErrorType<void>;
/**
 * @summary Load management records for the administrator console
 */
export declare function useGetAdminData<TData = Awaited<ReturnType<typeof getAdminData>>, TError = ErrorType<void>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAdminData>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getRunAdminActionUrl: () => string;
/**
 * @summary Run a validated, audited administrative action
 */
export declare const runAdminAction: (adminActionInput: AdminActionInput, options?: Parameters<typeof customFetch>[1]) => Promise<AdminActionResponse>;
export declare const getRunAdminActionMutationKey: () => readonly ["runAdminAction"];
export declare const getRunAdminActionMutationOptions: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof runAdminAction>>, TError, RunAdminActionMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof runAdminAction>>, TError, RunAdminActionMutationVariables, TContext>;
export type RunAdminActionMutationResult = NonNullable<Awaited<ReturnType<typeof runAdminAction>>>;
export type RunAdminActionMutationBody = BodyType<AdminActionInput>;
export type RunAdminActionMutationError = ErrorType<void>;
export type RunAdminActionMutationVariables = {
    data: BodyType<AdminActionInput>;
};
/**
* @summary Run a validated, audited administrative action
*/
export declare const useRunAdminAction: <TError = ErrorType<void>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof runAdminAction>>, TError, RunAdminActionMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof runAdminAction>>, TError, RunAdminActionMutationVariables, TContext>;
export declare const getListPublicCommunitiesUrl: (params?: ListPublicCommunitiesParams) => string;
/**
 * @summary List active, self-selected caste and community labels
 */
export declare const listPublicCommunities: (params?: ListPublicCommunitiesParams, options?: Parameters<typeof customFetch>[1]) => Promise<CommunityOption[]>;
export declare const getListPublicCommunitiesQueryKey: (params?: ListPublicCommunitiesParams) => readonly ["/api/communities", ...ListPublicCommunitiesParams[]];
export declare const getListPublicCommunitiesQueryOptions: <TData = Awaited<ReturnType<typeof listPublicCommunities>>, TError = ErrorType<unknown>>(params?: ListPublicCommunitiesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listPublicCommunities>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listPublicCommunities>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListPublicCommunitiesQueryResult = NonNullable<Awaited<ReturnType<typeof listPublicCommunities>>>;
export type ListPublicCommunitiesQueryError = ErrorType<unknown>;
/**
 * @summary List active, self-selected caste and community labels
 */
export declare function useListPublicCommunities<TData = Awaited<ReturnType<typeof listPublicCommunities>>, TError = ErrorType<unknown>>(params?: ListPublicCommunitiesParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listPublicCommunities>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListPublishedCoursesUrl: () => string;
/**
 * @summary List published courses
 */
export declare const listPublishedCourses: (options?: Parameters<typeof customFetch>[1]) => Promise<CourseSummary[]>;
export declare const getListPublishedCoursesQueryKey: () => readonly ["/api/courses"];
export declare const getListPublishedCoursesQueryOptions: <TData = Awaited<ReturnType<typeof listPublishedCourses>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listPublishedCourses>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listPublishedCourses>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListPublishedCoursesQueryResult = NonNullable<Awaited<ReturnType<typeof listPublishedCourses>>>;
export type ListPublishedCoursesQueryError = ErrorType<unknown>;
/**
 * @summary List published courses
 */
export declare function useListPublishedCourses<TData = Awaited<ReturnType<typeof listPublishedCourses>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listPublishedCourses>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListPublicPlansUrl: () => string;
/**
 * @summary List current active membership plans
 */
export declare const listPublicPlans: (options?: Parameters<typeof customFetch>[1]) => Promise<PublicPlan[]>;
export declare const getListPublicPlansQueryKey: () => readonly ["/api/plans"];
export declare const getListPublicPlansQueryOptions: <TData = Awaited<ReturnType<typeof listPublicPlans>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listPublicPlans>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listPublicPlans>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListPublicPlansQueryResult = NonNullable<Awaited<ReturnType<typeof listPublicPlans>>>;
export type ListPublicPlansQueryError = ErrorType<unknown>;
/**
 * @summary List current active membership plans
 */
export declare function useListPublicPlans<TData = Awaited<ReturnType<typeof listPublicPlans>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listPublicPlans>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export {};
//# sourceMappingURL=api.d.ts.map