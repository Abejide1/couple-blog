from fastapi import Depends, HTTPException, status
from fastapi.security import APIKeyHeader

# Simple API key header for couple code authentication
API_KEY_HEADER = APIKeyHeader(name="X-Couple-Code", auto_error=False)

async def validate_couple_code(api_key: str = Depends(API_KEY_HEADER)):
    """
    Validate the couple code from the X-Couple-Code header.
    This is a simple authentication mechanism - in a production app,
    you would want something more secure.
    """
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing couple code",
            headers={"WWW-Authenticate": "Couple-Code"},
        )
    
    # You could add additional validation logic here if needed
    # For now, we just return the code if it exists
    return api_key
