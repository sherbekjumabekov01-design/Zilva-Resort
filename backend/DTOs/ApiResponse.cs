namespace ZilvaResort.Api.DTOs;

public record ApiResponse<T>(
    bool Success,
    string Message,
    T? Data = default,
    List<string>? Errors = null
)
{
    public static ApiResponse<T> Ok(T data, string message = "Muvaffaqiyatli bajarildi.") =>
        new(true, message, data);

    public static ApiResponse<T> Fail(string message, List<string>? errors = null) =>
        new(false, message, default, errors);
}

public record PagedResponse<T>(
    List<T> Items,
    int TotalCount,
    int Page,
    int PageSize,
    int TotalPages
)
{
    public bool HasPreviousPage => Page > 1;
    public bool HasNextPage => Page < TotalPages;
}
